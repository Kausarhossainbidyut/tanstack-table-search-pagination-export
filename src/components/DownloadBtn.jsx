// DownloadBtn.jsx
import * as XLSX from 'xlsx';
import { Download } from "lucide-react";

const DownloadBtn = ({ data = [], user }) => {
  const handleDownload = () => {
    if (!data || !data.length) {
      alert("No data available to download!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, user ? `${user}.xlsx` : 'data.xlsx');
  };

  return (
    <button
      onClick={handleDownload}
      className='flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow transition'
    >
      <Download size={16} />
      Download
    </button>
  );
};

export default DownloadBtn;
