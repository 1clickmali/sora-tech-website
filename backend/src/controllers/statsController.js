const Commande = require('../models/Commande');
const Devis = require('../models/Devis');
const Contact = require('../models/Contact');
const Facture = require('../models/Facture');
const Produit = require('../models/Produit');

const getStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // ── Commandes ────────────────────────────────────────────────────────────
    const [totalCommandes, commandesMois, commandesLastMonth] = await Promise.all([
      Commande.countDocuments(),
      Commande.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Commande.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
    ]);

    // ── Revenus ──────────────────────────────────────────────────────────────
    const revenueAgg = await Commande.aggregate([
      { $match: { status: { $ne: 'annule' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const revenueMoisAgg = await Commande.aggregate([
      { $match: { status: { $ne: 'annule' }, createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    const revenueTotal = revenueAgg[0]?.total || 0;
    const revenueMois = revenueMoisAgg[0]?.total || 0;

    // ── Devis ────────────────────────────────────────────────────────────────
    const [totalDevis, devisNouveaux, devisAcceptes] = await Promise.all([
      Devis.countDocuments(),
      Devis.countDocuments({ status: 'nouveau' }),
      Devis.countDocuments({ status: 'accepte' }),
    ]);
    const tauxConversion = totalDevis > 0 ? Math.round((devisAcceptes / totalDevis) * 100) : 0;

    // ── Contacts ─────────────────────────────────────────────────────────────
    const [totalContacts, contactsNouveaux] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'nouveau' }),
    ]);

    // ── Graphique revenue par mois (6 derniers mois) ─────────────────────────
    const revenueParMois = await Commande.aggregate([
      {
        $match: {
          status: { $ne: 'annule' },
          createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) },
        },
      },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$total' },
          commandes: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const moisLabels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const chartData = revenueParMois.map(r => ({
      mois: moisLabels[r._id.month - 1],
      revenue: r.revenue,
      commandes: r.commandes,
    }));

    // ── Statuts commandes ────────────────────────────────────────────────────
    const statutsCommandes = await Commande.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // ── Factures impayées ────────────────────────────────────────────────────
    const facturesImpayees = await Facture.aggregate([
      { $match: { status: 'impayee' } },
      { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        commandes: {
          total: totalCommandes,
          mois: commandesMois,
          lastMonth: commandesLastMonth,
          evolution: commandesLastMonth > 0
            ? Math.round(((commandesMois - commandesLastMonth) / commandesLastMonth) * 100)
            : 100,
        },
        revenue: {
          total: revenueTotal,
          mois: revenueMois,
        },
        devis: {
          total: totalDevis,
          nouveaux: devisNouveaux,
          tauxConversion,
        },
        contacts: {
          total: totalContacts,
          nouveaux: contactsNouveaux,
        },
        charts: {
          revenueParMois: chartData,
          statutsCommandes: statutsCommandes.reduce((acc, s) => {
            acc[s._id] = s.count;
            return acc;
          }, {}),
        },
        factures: {
          impayees: facturesImpayees[0]?.count || 0,
          montantImpaye: facturesImpayees[0]?.total || 0,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getStats };
