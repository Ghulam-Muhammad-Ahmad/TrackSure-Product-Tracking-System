import React, { useState, useContext } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Edit } from "lucide-react"; // Import the Lucide Edit icon
import { Separator } from "./ui/separator";
import { AuthContext } from "../providers/authProvider"; // Import the AuthContext
import { API } from "../config/api"; // Import the API configurations
import axios from "axios"; // Import axios for making HTTP requests

function AccountMain() {
  const { profile, updateProfile } = useContext(AuthContext); // Use the profile and updateProfile from the AuthContext
  const [userData, setUserData] = useState(profile); // Initialize userData with the profile
  const [isEditable, setIsEditable] = useState(false); // Track edit mode

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare the updated profile data
    const updatedProfileData = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone_number: userData.phone_number,
      location: userData.location,
    };

    try {
      // Send request to edit profile
      const response = await axios.put(API.EDIT_PROFILE, updatedProfileData);
      if (response.data.success) {
        console.log("Profile updated successfully:", response.data);
        // Update the profile in the AuthContext
        updateProfile(updatedProfileData);
        // Update the local state to reflect the changes
        setUserData(updatedProfileData);
        setIsEditable(false); // Disable edit mode after successful submission
      } else {
        console.error("Failed to update profile:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  return (
    <div className="w-full relative pt-5">
      <>
        <h2 className="text-2xl font-bold tracking-tight">Account Settings</h2>
        <p className="text-muted-foreground">
          Change your account Settings and save it.{" "}
        </p>

        <Separator className="my-4" />

        <form onSubmit={handleSubmit}>
          <div className="account-formgroup">
            <label htmlFor="first_name">First Name</label>
            <Input
              name="first_name"
              id="first_name"
              value={userData.first_name}
              onChange={handleInputChange}
              placeholder="Enter your first name"
              disabled={!isEditable}
            />
          </div>
          <div className="account-formgroup">
            <label htmlFor="last_name">Last Name</label>
            <Input
              name="last_name"
              id="last_name"
              value={userData.last_name}
              onChange={handleInputChange}
              placeholder="Enter your last name"
              disabled={!isEditable}
            />
          </div>
          <div className="account-formgroup">
            <label htmlFor="phone_number">Phone Number</label>
            <Input
              name="phone_number"
              id="phone_number"
              value={userData.phone_number}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              disabled={!isEditable}
            />
          </div>
          <div className="account-formgroup">
            <label htmlFor="location">Location</label>
            <Input
              name="location"
              id="location"
              value={userData.location}
              onChange={handleInputChange}
              placeholder="Enter your location"
              disabled={!isEditable}
            />
          </div>
          <div className="flex justify-start gap-2 mt-4">
            {!isEditable ? (
              <Button
                onClick={toggleEdit}
                type="button"
                className="cursor-pointer"
                variant="secondary"
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            ) : (
              <>
                <Button
                  onClick={toggleEdit}
                  type="button"
                  className="cursor-pointer"
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="default">
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </form>
      </>
    </div>
  );
}

export default AccountMain;
