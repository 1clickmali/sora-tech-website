const Produit = require('../models/Produit');
const StockMovement = require('../models/StockMovement');
const { normalizeProductPayload } = require('../config/productCatalog');

function isStockManaged(product) {
  return product.category === 'Matériel' || product.digital === false;
}

function getStockStatus(product) {
  const stock = Number(product.stock ?? -1);
  const threshold = Number(product.lowStockThreshold ?? 5);

  if (stock < 0) return 'illimite';
  if (stock <= 0) return 'rupture';
  if (stock <= threshold) return 'faible';
  return 'disponible';
}

function normalizeStockProduct(product) {
  const normalized = normalizeProductPayload(product);
  return {
    ...normalized,
    lowStockThreshold: Number(normalized.lowStockThreshold ?? 5),
    stockStatus: getStockStatus(normalized),
  };
}

const getStockOverview = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [rawProducts, movements, monthlyAgg] = await Promise.all([
      Produit.find({}).sort({ category: 1, subcategory: 1, title: 1 }).lean(),
      StockMovement.find({})
        .sort({ createdAt: -1 })
        .limit(25)
        .populate('productId', 'title category subcategory image')
        .lean(),
      StockMovement.aggregate([
        { $match: { createdAt: { $gte: startOfMonth } } },
        {
          $group: {
            _id: '$type',
            quantity: { $sum: '$quantity' },
            value: { $sum: { $multiply: ['$quantity', '$unitCost'] } },
          },
        },
      ]),
    ]);

    const products = rawProducts
      .map(normalizeStockProduct)
      .filter(isStockManaged);

    const rupture = products.filter(p => p.stockStatus === 'rupture');
    const faibles = products.filter(p => p.stockStatus === 'faible');
    const disponibles = products.filter(p => p.stockStatus === 'disponible');
    const illimites = products.filter(p => p.stockStatus === 'illimite');
    const totalUnits = products.reduce((sum, p) => sum + (p.stock > 0 ? p.stock : 0), 0);
    const inventoryValue = products.reduce((sum, p) => sum + (p.stock > 0 ? p.stock * (p.price || 0) : 0), 0);

    const monthly = monthlyAgg.reduce((acc, item) => {
      acc[item._id] = item;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        metrics: {
          totalProducts: products.length,
          totalUnits,
          inventoryValue,
          available: disponibles.length,
          lowStock: faibles.length,
          outOfStock: rupture.length,
          unlimited: illimites.length,
          restockedThisMonth: monthly.approvisionnement?.quantity || 0,
          soldThisMonth: monthly.sortie?.quantity || 0,
          purchasedValueThisMonth: monthly.approvisionnement?.value || 0,
        },
        alerts: [...rupture, ...faibles].slice(0, 8),
        products,
        movements,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createStockMovement = async (req, res) => {
  try {
    const {
      productId,
      type,
      quantity,
      unitCost = 0,
      supplier = '',
      reference = '',
      note = '',
    } = req.body;

    const product = await Produit.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Produit introuvable' });

    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty < 0) {
      return res.status(400).json({ success: false, message: 'Quantité invalide' });
    }

    const beforeStock = product.stock < 0 ? 0 : Number(product.stock || 0);
    let afterStock = beforeStock;

    if (type === 'approvisionnement' || type === 'retour') afterStock = beforeStock + qty;
    else if (type === 'sortie' || type === 'perte') afterStock = beforeStock - qty;
    else if (type === 'ajustement') afterStock = qty;
    else return res.status(400).json({ success: false, message: 'Type de mouvement invalide' });

    if (afterStock < 0) {
      return res.status(400).json({ success: false, message: 'Stock insuffisant pour cette sortie' });
    }

    product.stock = afterStock;
    product.digital = false;
    if (supplier) product.supplier = supplier;
    if (Number(unitCost) > 0) product.lastUnitCost = Number(unitCost);
    if (type === 'approvisionnement') product.lastRestockedAt = new Date();
    await product.save();

    const movement = await StockMovement.create({
      productId: product._id,
      type,
      quantity: qty,
      beforeStock,
      afterStock,
      unitCost: Number(unitCost) || 0,
      supplier,
      reference,
      note,
      source: 'admin',
      createdBy: req.user?._id,
      createdByName: req.user?.name || 'Admin',
    });

    res.status(201).json({ success: true, data: movement });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateStockSettings = async (req, res) => {
  try {
    const allowed = ['lowStockThreshold', 'sku', 'supplier'];
    const update = {};

    allowed.forEach((key) => {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    });

    const product = await Produit.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Produit introuvable' });

    res.json({ success: true, data: normalizeStockProduct(product.toObject()) });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { getStockOverview, createStockMovement, updateStockSettings };
