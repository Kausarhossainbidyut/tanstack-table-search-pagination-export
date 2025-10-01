import * as XLSX from 'xlsx';

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
            className='download-btn bg-blue-700 p-2 rounded text-white'
            onClick={handleDownload}
        >
            Download
        </button>
    );
};

export default DownloadBtn;
