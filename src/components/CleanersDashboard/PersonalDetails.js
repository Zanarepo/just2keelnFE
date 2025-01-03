import React, { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PersonalDetails = () => {
  const [details, setDetails] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    profile_picture_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState(null); // To display image preview
  const [isEditing, setIsEditing] = useState(false); // To toggle between edit mode and view mode
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
  
      const email = localStorage.getItem('email');

    
      if (!email) {
        toast.error("User email not found. Please log in again.");
        setLoading(false);
        return;
      }
  
      try {
        const { data, error } = await supabase
          .from('cleaners_main_profiles')
          .select('full_name, email, phone_number, profile_picture_url')
          .eq('email', email)
          .single();
  
        if (error || !data) {
          toast.error("Error fetching profile details or no profile found.");
        } else {
          setDetails(data);
          toast.success("Profile details loaded successfully.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Unexpected error occurred while fetching profile details.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchDetails();
  }, []);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Preview the selected image
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const uploadProfilePicture = async () => {
    if (!file) return null;
    const fileName = `${details.email}_${file.name}`;
  
    setIsUploading(true);
  
    const { error } = await supabase.storage
      .from('file storage') // Ensure this matches your actual bucket name
      .upload(fileName, file);
  
    setIsUploading(false);
  
    if (error) {
      toast.error("Failed to upload profile picture");
      return null;
    }
  
    const { data } = supabase.storage
      .from('file storage')
      .getPublicUrl(fileName);
  
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let profilePictureUrl = details.profile_picture_url;
    if (file) {
      profilePictureUrl = await uploadProfilePicture();
    }

    const { error } = await supabase.from('cleaners_main_profiles')
      .update({
        full_name: details.full_name,
        phone_number: details.phone_number,
        profile_picture_url: profilePictureUrl
      })
      .eq('email', details.email);

    if (error) {
      toast.error("Failed to update profile details");
    } else {
      toast.success("Profile updated successfully");
    }
    setLoading(false);
    setIsEditing(false); // Turn off edit mode after submitting
  };

  const handleEditClick = () => {
    setIsEditing(true); // Enable edit mode
  };

  if (loading) return <div>Loading...</div>;
 




  return (
    <div className="flex justify-center items-center min-h-screen bg-white pt-4">
      <div className="p-8 bg-white rounded-lg shadow-xl w-full sm:max-w-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-green-500">Personal Details</h2>
  
        {/* Avatar and Name Section */}
        <div className="flex justify-center items-center flex-col mb-6">
          {/* Display the profile picture or default avatar */}
          <div className="w-36 h-36 rounded-full overflow-hidden mb-4 shadow-lg">
            <img
              src={profilePicPreview || details.profile_picture_url || "/path-to-default-avatar.jpg"}
              alt="Profile Avatar"
              className="w-full h-full object-cover"
            />
          </div>
  
          {/* User Full Name */}
          {isEditing ? (
            <input
              type="text"
              name="full_name"
              value={details.full_name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 mb-4 text-lg font-semibold text-gray-700"
              placeholder="Enter your full name"
            />
          ) : (
            <h3 className="text-lg font-semibold text-gray-800">{details.full_name}</h3>
          )}
        </div>
  
        {/* Email and Phone Number Section */}
        <div className="space-y-4">
          {/* Email (display-only) */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <p className="text-sm text-gray-600">{details.email}</p>
          </div>
  
          {/* Phone Number */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number</label>
            {isEditing ? (
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                value={details.phone_number}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                required
                placeholder="Enter your phone number"
              />
            ) : (
              <p className="text-sm text-gray-600">{details.phone_number}</p>
            )}
          </div>
        </div>
  
        {/* Profile Picture Section */}
        <div className="mt-6">
          {isEditing ? (
            <>
              <input
                type="file"
                id="profile_picture"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
              {isUploading && <div className="text-center text-blue-500 mt-2">Uploading...</div>}
            </>
          ) : null}
        </div>
  
        {/* Edit / Save Button */}
        <div className="mt-8">
          {isEditing ? (
            <button
              onClick={handleSubmit}
              className="w-full py-3 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={handleEditClick}
              className="w-full py-3 px-6 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
  
};  

export default PersonalDetails;
