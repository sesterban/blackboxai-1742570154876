document.getElementById('disinfectionForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Initialize jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add header
    doc.setFontSize(10);
    doc.text('Form: LG-1.012-MIC', 15, 15);

    doc.setFontSize(14);
    doc.text('MEDICAL AFFAIRS – LABORATORY SERVICES', doc.internal.pageSize.width/2, 25, { align: 'center' });
    doc.text('SURFACE DISINFECTION MONITORING', doc.internal.pageSize.width/2, 35, { align: 'center' });

    // Add form details
    doc.setFontSize(11);
    doc.text(`UNIT/LOCATION: ${data.unit}`, 15, 45);
    doc.text(`MONTH/YEAR: ${data.monthYear}`, doc.internal.pageSize.width - 80, 45);

    // Add instruction
    doc.setFontSize(10);
    doc.text('INSTRUCTION: Check the box if performed and put your initials.', 15, 55);

    // Create table data
    const items = ['Benchtops', 'Keyboard', 'Mouse', 'Monitor', 'Phone'];
    const headers = ['Temp.', ...Array.from({ length: 31 }, (_, i) => (i + 1).toString())];
    const rows = items.map(item => [
        item,
        ...Array.from({ length: 31 }, (_, i) => {
            const checkbox = document.querySelector(`input[name="${item.toLowerCase()}${i + 1}"]`);
            return checkbox.checked ? '✓' : '';
        })
    ]);

    // Add initials row
    rows.push([
        'Initials',
        ...Array.from({ length: 31 }, (_, i) => data[`initials${i + 1}`] || '')
    ]);

    // Add table
    doc.autoTable({
        head: [headers],
        body: rows,
        startY: 60,
        theme: 'grid',
        styles: {
            fontSize: 8,
            cellPadding: 1
        },
        headStyles: {
            fillColor: [240, 240, 240],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
        },
        columnStyles: {
            0: { cellWidth: 25 }
        }
    });

    // Add notes
    const currentY = doc.previousAutoTable.finalY + 10;
    doc.setFontSize(8);
    const notes = [
        '• Disinfection must be performed by Section In-Charge and/or assigned rotating staff BEFORE and AFTER their duty hours (8am-5pm).',
        '• Disinfect surfaces with IPC Approved Disinfectant Solution. For electronic devices, use Sani-Cloth 70.',
        '• Follow manufacturer\'s recommendation for disinfecting machines and equipments.',
        '• Monitoring of compliance is the responsibility of Section In-Charge.'
    ];
    
    notes.forEach((note, index) => {
        doc.text(note, 15, currentY + (index * 5));
    });

    // Add signatures
    const sigY = currentY + (notes.length * 5) + 10;
    doc.setFontSize(10);
    doc.text(`Checked by / Date: ${data.checkedBy || '_________________'}`, 15, sigY);
    doc.text(`Reviewed by / Date: ${data.reviewedBy || '_________________'}`, 15, sigY + 10);
    doc.text(`Approved by / Date: ${data.approvedBy || '_________________'}`, 15, sigY + 20);

    // Save the PDF
    const fileName = `Surface_Disinfection_Monitoring_${data.monthYear || 'form'}.pdf`;
    doc.save(fileName);
});