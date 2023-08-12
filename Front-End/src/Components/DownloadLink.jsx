// eslint-disable-next-line react/prop-types
const DownloadLink = ({ fileUrl, fileName }) => {
  const handleDownload = () => {
    if (!fileUrl) {
      alert("No file available for download.");
      return;
    }

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {fileUrl ? (
        <button onClick={handleDownload}>Download {fileName}</button>
      ) : (
        <p>No file available for download.</p>
      )}
    </div>
  );
};

export default DownloadLink;
