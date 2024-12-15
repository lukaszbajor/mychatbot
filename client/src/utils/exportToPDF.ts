import { jsPDF } from "jspdf";
// @ts-ignore
import { RobotoBase64 } from '../utils/fontConventer.js';
import { removeHtmlTags } from '../utils/removeHtmlTags.ts';

const exportToPDF = (messages:any) => {
  const doc = new jsPDF();



  
  doc.addFileToVFS("Roboto-Regular.ttf", RobotoBase64);
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.setFont("Roboto");

 
  doc.setFontSize(16);
  doc.text("Historia rozmowy", 10, 10);

  let y = 20; 
  
  messages.forEach((message:any) => {
  const sender = message.sender === "user" ? "Użytkownik:" : "Bot:";
  let text = `${sender} ${message.text}`;
    

    text = removeHtmlTags(text);

    if (message.sender === "user") {
      doc.setTextColor(169, 169, 169); 
    } else {
      doc.setTextColor(0, 0, 139); 
    }

   
    const splitText = doc.splitTextToSize(text, 180); 
    splitText.forEach((line:any) => {
      if (y > 280) {
        doc.addPage();
        y = 10; 
      }
      doc.text(line, 10, y);
      y += 10; 
    });
  });
  doc.save("historia_rozmowy.pdf");
};

export default exportToPDF;
