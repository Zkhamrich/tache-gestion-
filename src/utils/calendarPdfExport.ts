
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CalendarEvent } from '@/types/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Exporte les événements du calendrier au format PDF
 * @param events - Liste des événements à exporter
 */
export const exportCalendarToPdf = async (events: CalendarEvent[]): Promise<void> => {
  try {
    // Initialiser jsPDF
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Configuration des couleurs et styles
    const primaryColor: [number, number, number] = [59, 130, 246];
    const headerColor: [number, number, number] = [241, 245, 249];
    const textColor: [number, number, number] = [51, 65, 85];

    // Titre du document
    const currentDate = format(new Date(), 'dd MMMM yyyy', { locale: fr });
    doc.setFontSize(18);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Calendrier des Événements du Gouverneur', 20, 25);
    
    doc.setFontSize(12);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(`Généré le ${currentDate}`, 20, 35);

    // Gérer le cas où il n'y a pas d'événements
    if (events.length === 0) {
      doc.setFontSize(14);
      doc.text('Aucun événement à afficher pour la période sélectionnée.', 20, 60);
      
      const fileName = `calendrier_evenements_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      doc.save(fileName);
      return;
    }

    // Trier les événements par date
    const sortedEvents = events.sort((a, b) => 
      new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
    );

    // Définir les colonnes du tableau
    const columns = [
      { header: 'Date', dataKey: 'date' },
      { header: 'Heure', dataKey: 'heure' },
      { header: 'Objet de la réunion', dataKey: 'objet' },
      { header: 'Type', dataKey: 'type' },
      { header: 'Division/Lieu', dataKey: 'lieu' },
      { header: 'Statut', dataKey: 'statut' }
    ];

    // Transformer les événements en données de tableau
    const tableRows = sortedEvents.map(event => {
      const startDate = new Date(event.startDateTime);
      const endDate = new Date(event.endDateTime);
      
      return {
        date: format(startDate, 'dd/MM/yyyy', { locale: fr }),
        heure: `${format(startDate, 'HH:mm')} - ${format(endDate, 'HH:mm')}`,
        objet: sanitizeText(event.title) || 'Non spécifié',
        type: sanitizeText(event.eventType.replace('-', ' ').toUpperCase()),
        lieu: sanitizeText(event.location) || 'Non spécifié',
        statut: getStatusLabel(event.status)
      };
    });

    // Générer le tableau avec autoTable
    autoTable(doc, {
      startY: 45,
      head: [columns.map(col => col.header)],
      body: tableRows.map(row => columns.map(col => row[col.dataKey as keyof typeof row])),
      styles: {
        fontSize: 9,
        cellPadding: 3,
        textColor: textColor,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: headerColor,
        textColor: textColor,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 25, halign: 'center' }, // Date
        1: { cellWidth: 30, halign: 'center' }, // Heure
        2: { cellWidth: 80, halign: 'left' },   // Objet
        3: { cellWidth: 30, halign: 'center' }, // Type
        4: { cellWidth: 60, halign: 'left' },   // Lieu
        5: { cellWidth: 25, halign: 'center' }  // Statut
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      margin: { top: 45, left: 20, right: 20 },
      didDrawPage: (data) => {
        // Ajouter numéro de page
        const pageNumber = doc.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.text(
          `Page ${data.pageNumber} sur ${pageNumber}`,
          doc.internal.pageSize.width - 40,
          doc.internal.pageSize.height - 10
        );
        
        // Ajouter pied de page
        doc.text(
          'Document généré automatiquement par le système de gestion du Gouvernorat',
          20,
          doc.internal.pageSize.height - 10
        );
      }
    });

    // Ajouter statistiques
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    
    doc.setFontSize(12);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Statistiques', 20, finalY);
    
    doc.setFontSize(10);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    
    const stats = generateEventStats(events);
    const statsText = [
      `Total d'événements: ${stats.total}`,
      `Confirmés: ${stats.confirmed}`,
      `En attente: ${stats.scheduled}`,
      `Réunions: ${stats.reunions}`,
      `Rendez-vous: ${stats.rendezVous}`,
      `Conférences: ${stats.conferences}`
    ];
    
    statsText.forEach((stat, index) => {
      doc.text(stat, 20, finalY + 10 + (index * 5));
    });

    // Sauvegarder le fichier
    const fileName = `calendrier_evenements_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    doc.save(fileName);

  } catch (error) {
    console.error('Erreur lors de l\'export PDF:', error);
    throw new Error('Échec de l\'export PDF');
  }
};

/**
 * Sanitise le texte pour l'export PDF (gère les caractères spéciaux)
 */
const sanitizeText = (text: string | undefined): string => {
  if (!text) return '';
  
  return text
    .replace(/[^\w\s\-.,!?()]/g, '') // Enlever les caractères spéciaux problématiques
    .trim()
    .substring(0, 100); // Limiter la longueur
};

/**
 * Convertit le statut en libellé français
 */
const getStatusLabel = (status: string): string => {
  const statusLabels: Record<string, string> = {
    'scheduled': 'Programmé',
    'confirmed': 'Confirmé',
    'cancelled': 'Annulé',
    'completed': 'Terminé'
  };
  
  return statusLabels[status] || status;
};

/**
 * Génère des statistiques sur les événements
 */
const generateEventStats = (events: CalendarEvent[]) => {
  return {
    total: events.length,
    confirmed: events.filter(e => e.status === 'confirmed').length,
    scheduled: events.filter(e => e.status === 'scheduled').length,
    reunions: events.filter(e => e.eventType === 'reunion').length,
    rendezVous: events.filter(e => e.eventType === 'rendez-vous').length,
    conferences: events.filter(e => e.eventType === 'conference').length
  };
};
