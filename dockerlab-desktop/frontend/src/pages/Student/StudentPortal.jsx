import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';

const StudentPortal = () => {
  const [dockerImages, setDockerImages] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageOSMap, setImageOSMap] = useState({});

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/images');
        setDockerImages(res.data);
      } catch (error) {
        console.error('❌ Failed to fetch images:', error);
      }
    };

    fetchImages();

    if (window.electronAPI?.runDockerCommand) {
      console.log('✅ electronAPI is available');
    } else {
      console.error('❌ electronAPI is undefined');
    }
  }, []);

  const handleRunCommand = (cmd) => {
    if (!cmd) return alert('❌ Command is missing!');
    if (window.electronAPI?.runDockerCommand) {
      window.electronAPI.runDockerCommand(cmd);
    } else {
      alert('❌ Electron API not available.');
    }
  };

  const handleOSChange = (id, os) => {
    setImageOSMap((prev) => ({ ...prev, [id]: os }));
  };

  const getOS = (id) => imageOSMap[id] || 'ubuntu';

  const filteredImages = dockerImages.filter((img) =>
    img.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <Navbar isAdmin={false} />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">Student Labs</h1>

        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="🔍 Search by subject name..."
            className="w-full md:w-1/2 px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredImages.length === 0 ? (
          <p className="text-center text-gray-500 italic">No matching labs found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredImages.map((img) => (
              <div
                key={img._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-md p-5 hover:shadow-xl transition duration-300 cursor-pointer"
                onClick={() => setSelectedImage(img)}
              >
                <h3 className="text-xl font-semibold text-indigo-700">
                  {img.semester} - {img.subject}
                </h3>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 relative shadow-lg">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-indigo-700 mb-3">
              {selectedImage.semester} - {selectedImage.subject}
            </h2>

            <div className="flex justify-center mb-4 space-x-2">
              <button
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  getOS(selectedImage._id) === 'ubuntu'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => handleOSChange(selectedImage._id, 'ubuntu')}
              >
                Ubuntu
              </button>
              <button
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  getOS(selectedImage._id) === 'windows'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => handleOSChange(selectedImage._id, 'windows')}
              >
                Windows
              </button>
            </div>

            {/* Pull Command */}
            <div className="mb-4">
              <p className="font-medium text-gray-700">📥 Pull Command</p>
              <code className="block bg-gray-100 rounded-lg p-2 text-sm text-gray-800 overflow-x-auto">
                {getOS(selectedImage._id) === 'ubuntu'
                  ? selectedImage.ubuntuPullCommand
                  : selectedImage.windowsPullCommand}
              </code>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      getOS(selectedImage._id) === 'ubuntu'
                        ? selectedImage.ubuntuPullCommand
                        : selectedImage.windowsPullCommand
                    )
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Copy
                </button>
                <button
                  onClick={() =>
                    handleRunCommand(
                      getOS(selectedImage._id) === 'ubuntu'
                        ? selectedImage.ubuntuPullCommand
                        : selectedImage.windowsPullCommand
                    )
                  }
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                >
                  Run
                </button>
              </div>
            </div>

            {/* Run Command */}
            <div className="mb-4">
              <p className="font-medium text-gray-700">▶️ Run Command</p>
              <code className="block bg-gray-100 rounded-lg p-2 text-sm text-gray-800 overflow-x-auto">
                {getOS(selectedImage._id) === 'ubuntu'
                  ? selectedImage.ubuntuRunCommand
                  : selectedImage.windowsRunCommand}
              </code>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      getOS(selectedImage._id) === 'ubuntu'
                        ? selectedImage.ubuntuRunCommand
                        : selectedImage.windowsRunCommand
                    )
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                >
                  Copy
                </button>
                <button
                  onClick={() =>
                    handleRunCommand(
                      getOS(selectedImage._id) === 'ubuntu'
                        ? selectedImage.ubuntuRunCommand
                        : selectedImage.windowsRunCommand
                    )
                  }
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                >
                  Run
                </button>
              </div>
            </div>

            {/* Instructions and Notes */}
            <div className="text-sm text-gray-600 mt-3">
              {getOS(selectedImage._id) === 'ubuntu' &&
                selectedImage.ubuntuInstructions && (
                  <p className="mb-1 italic">📝 {selectedImage.ubuntuInstructions}</p>
                )}
              {getOS(selectedImage._id) === 'windows' &&
                selectedImage.windowsInstructions && (
                  <p className="mb-1 italic">📝 {selectedImage.windowsInstructions}</p>
                )}
              {selectedImage.notes && (
                <p className="text-xs text-gray-500">🗒️ {selectedImage.notes}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPortal;
