import { saveAs } from 'file-saver';
/* eslint-disable */
import XLSX from 'xlsx';

const s2ab = s => {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  /* eslint-disable */
  for (let i = 0; i !== s.length; i += 1) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
};

const ExportXml = (json, filename, sheetName) => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(json);
  wb.SheetNames.push(sheetName);
  wb.Sheets[sheetName] = ws;
  const defaultCellStyle = {
    font: { name: 'Verdana', sz: 13, color: 'FF00FF88' },
    fill: { fgColor: { rgb: 'FFFFAA00' } },
  };
  const wopts = {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary',
    cellStyles: true,
    defaultCellStyle,
    showGridLines: false,
  };
  const wbout = XLSX.write(wb, wopts);
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  saveAs(blob, `${filename}.xlsx`);
};

export default ExportXml;
