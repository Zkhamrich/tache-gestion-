
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Task, TaskStatus } from '@/types/task';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  division: string;
  description?: string;
}

export const exportTasksToPDF = (tasks: Task[], title: string = 'Rapport des Tâches') => {
  const doc = new jsPDF();
  
  // En-tête
  doc.setFontSize(20);
  doc.text(title, 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 20, 30);
  
  // Statistiques
  const stats = {
    total: tasks.length,
    enAttente: tasks.filter(t => t.status === 'En attente').length,
    enCours: tasks.filter(t => t.status === 'En cours').length,
    termine: tasks.filter(t => t.status === 'Terminé').length,
    annule: tasks.filter(t => t.status === 'Annulé').length
  };
  
  let yPosition = 45;
  doc.text(`Total des tâches: ${stats.total}`, 20, yPosition);
  doc.text(`En attente: ${stats.enAttente}`, 20, yPosition + 7);
  doc.text(`En cours: ${stats.enCours}`, 20, yPosition + 14);
  doc.text(`Terminées: ${stats.termine}`, 20, yPosition + 21);
  doc.text(`Annulées: ${stats.annule}`, 20, yPosition + 28);
  
  // Tableau des tâches
  const tableData = tasks.map(task => [
    task.name,
    task.divisionName,
    task.status,
    task.priority || 'Non définie',
    new Date(task.dueDate).toLocaleDateString('fr-FR'),
    task.assignedTo || 'Non assignée',
    task.isForSgFollowup ? 'Oui' : 'Non'
  ]);
  
  doc.autoTable({
    head: [['Tâche', 'Division', 'Statut', 'Priorité', 'Échéance', 'Assignée à', 'Suivi SG']],
    body: tableData,
    startY: yPosition + 40,
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 25 },
      2: { cellWidth: 20 },
      3: { cellWidth: 20 },
      4: { cellWidth: 20 },
      5: { cellWidth: 25 },
      6: { cellWidth: 15 }
    }
  });
  
  // Sauvegarde
  doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportCalendarEventsToPDF = (events: CalendarEvent[], title: string = 'Calendrier des Événements') => {
  const doc = new jsPDF();
  
  // En-tête
  doc.setFontSize(20);
  doc.text(title, 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 20, 30);
  doc.text(`Nombre d'événements: ${events.length}`, 20, 40);
  
  // Tableau des événements
  const tableData = events.map(event => [
    new Date(event.date).toLocaleDateString('fr-FR'),
    event.title,
    event.division,
    event.time,
    event.location,
    event.description || 'Aucune description'
  ]);
  
  doc.autoTable({
    head: [['Date', 'Objet de la réunion', 'Division', 'Heure', 'Siège', 'Description']],
    body: tableData,
    startY: 55,
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [52, 152, 219],
      textColor: 255
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 40 },
      2: { cellWidth: 30 },
      3: { cellWidth: 20 },
      4: { cellWidth: 30 },
      5: { cellWidth: 35 }
    }
  });
  
  // Sauvegarde
  doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportTaskStatsToPDF = (tasks: Task[], title: string = 'Statistiques des Tâches') => {
  const doc = new jsPDF();
  
  // En-tête
  doc.setFontSize(20);
  doc.text(title, 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 20, 30);
  
  // Calcul des statistiques détaillées
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Terminé').length;
  const inProgressTasks = tasks.filter(t => t.status === 'En cours').length;
  const pendingTasks = tasks.filter(t => t.status === 'En attente').length;
  const cancelledTasks = tasks.filter(t => t.status === 'Annulé').length;
  
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : '0';
  
  // Statistiques générales
  let yPos = 50;
  doc.setFontSize(14);
  doc.text('Statistiques Générales', 20, yPos);
  
  yPos += 15;
  doc.setFontSize(12);
  doc.text(`Total des tâches: ${totalTasks}`, 30, yPos);
  doc.text(`Taux de completion: ${completionRate}%`, 30, yPos + 10);
  doc.text(`Tâches terminées: ${completedTasks}`, 30, yPos + 20);
  doc.text(`Tâches en cours: ${inProgressTasks}`, 30, yPos + 30);
  doc.text(`Tâches en attente: ${pendingTasks}`, 30, yPos + 40);
  doc.text(`Tâches annulées: ${cancelledTasks}`, 30, yPos + 50);
  
  // Statistiques par division
  yPos += 70;
  doc.setFontSize(14);
  doc.text('Répartition par Division', 20, yPos);
  
  const divisionStats = tasks.reduce((acc, task) => {
    if (!acc[task.divisionName]) {
      acc[task.divisionName] = { total: 0, completed: 0, inProgress: 0, pending: 0 };
    }
    acc[task.divisionName].total++;
    if (task.status === 'Terminé') acc[task.divisionName].completed++;
    if (task.status === 'En cours') acc[task.divisionName].inProgress++;
    if (task.status === 'En attente') acc[task.divisionName].pending++;
    return acc;
  }, {} as Record<string, { total: number; completed: number; inProgress: number; pending: number }>);
  
  const divisionTableData = Object.entries(divisionStats).map(([division, stats]) => [
    division,
    stats.total.toString(),
    stats.completed.toString(),
    stats.inProgress.toString(),
    stats.pending.toString(),
    stats.total > 0 ? `${(stats.completed / stats.total * 100).toFixed(1)}%` : '0%'
  ]);
  
  doc.autoTable({
    head: [['Division', 'Total', 'Terminées', 'En cours', 'En attente', 'Taux completion']],
    body: divisionTableData,
    startY: yPos + 10,
    styles: {
      fontSize: 10,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [46, 204, 113],
      textColor: 255
    }
  });
  
  // Sauvegarde
  doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};
