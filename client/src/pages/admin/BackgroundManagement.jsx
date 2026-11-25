import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash2, Upload } from "lucide-react";

const BackgroundManagement = () => {
  const [backgrounds, setBackgrounds] = useState([]);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");

  const loadBackgrounds = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/backgrounds");
      setBackgrounds(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadBackgrounds();
  }, []);

  const addBackground = async () => {
    if (!image) {
      toast.error("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("order", backgrounds.length + 1);

    try {
      await axios.post(
        "http://localhost:5000/api/backgrounds",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Background Added");

      setImage(null);
      setTitle("");

      document.getElementById("backgroundFile").value = "";

      loadBackgrounds();
    } catch (err) {
      console.log(err);
      toast.error("Upload Failed");
    }
  };

  const deleteBackground = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/backgrounds/${id}`
      );

      toast.success("Deleted");
      loadBackgrounds();
    } catch (err) {
      toast.error("Delete Failed");
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-2">
        Background Management
      </h1>

      <p className="text-gray-500 mb-8">
        Manage Login & Register Background Images
      </p>

      <div className="bg-white rounded-xl shadow p-6 mb-8">

        <div className="space-y-4">

          <input
            id="backgroundFile"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <button
            onClick={addBackground}
            className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Upload size={18} />
            Upload Background
          </button>

        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {backgrounds.map((bg) => (

          <div
            key={bg._id}
            className="bg-white rounded-xl shadow overflow-hidden"
          >

            <img
              src={`http://localhost:5000${bg.image}`}
              alt=""
              className="w-full h-52 object-cover"
            />

            <div className="p-4">

              <h3 className="font-bold mb-3">
                {bg.title}
              </h3>

              <button
                onClick={() => deleteBackground(bg._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default BackgroundManagement;