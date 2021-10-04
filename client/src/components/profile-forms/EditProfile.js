import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import {
  createProfile,
  getCurrentProfile,
  deleteAccount,
} from "../../store/profile/profile-actions";

const initialState = {
  highschool: "",
  college: "",
  job: "",
  location: "",
  relationshipstatus: "",
  interests: "",
  bio: "",
};

const EditProfile = ({ history }) => {
  const { profile, loading } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (!profile) dispatch(getCurrentProfile());
    if (!loading && profile) {
      const profileData = { ...initialState };
      for (const key in profile) {
        if (key in profileData) {
          profileData[key] = profile[key];
        }
      }
      setFormData(profileData);
    }
  }, [profile]);

  const {
    highschool,
    college,
    job,
    location,
    relationshipstatus,
    interests,
    bio,
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createProfile(formData, history, true));
  };

  const onDelete = () => {
    dispatch(deleteAccount());
  };

  if (!profile && !loading) {
    return <Redirect to="/create-profile" />;
  }

  if (loading) return <h1 className="p-1 mt-2">Loading...</h1>;

  return (
    <main>
      {profile && !loading && (
        <div className="registerlogin register desktop-mt-5 maxw-70">
          <div className="registerlogin-left">
            <div className="registerlogin-image alt-grad-bg"></div>
          </div>
          <div>
            <h1 className="large text-primary">Edit Your Profile</h1>
            <p className="lead mb-2">
              Let's get some information to make your profile stand out
            </p>
            <form onSubmit={onSubmit} className="form">
              <div className="form-group">
                <input
                  onChange={onChange}
                  value={highschool}
                  type="text"
                  placeholder="Highschool"
                  name="highschool"
                />
              </div>
              <div className="form-group">
                <input
                  onChange={onChange}
                  value={college}
                  type="text"
                  placeholder="College"
                  name="college"
                />
              </div>
              <div className="form-group">
                <input
                  onChange={onChange}
                  value={job}
                  type="text"
                  placeholder="Job"
                  name="job"
                />
              </div>
              <div className="form-group">
                <input
                  onChange={onChange}
                  value={location}
                  type="text"
                  placeholder="Location"
                  name="location"
                />
              </div>
              <div className="form-group">
                <select
                  onChange={onChange}
                  value={relationshipstatus}
                  name="relationshipstatus"
                >
                  <option value="">Select Relationship Status</option>
                  <option value="Single">Single</option>
                  <option value="In a relationship">In a relationship</option>
                  <option value="Married">Married</option>
                  <option value="Its complicated">It's complicated</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <input
                  onChange={onChange}
                  value={interests}
                  type="text"
                  placeholder="Interests"
                  name="interests"
                />
              </div>
              <div className="form-group">
                <textarea
                  onChange={onChange}
                  value={bio}
                  placeholder="A short bio of yourself"
                  name="bio"
                  maxLength="300"
                ></textarea>
              </div>
              <button className="link-button w-100 mb-1 invert">Submit</button>
              <Link
                className="link-button mb-2"
                to={`/profile/${user.payload._id}`}
              >
                Go Back
              </Link>
            </form>
            <button onClick={onDelete} className="link-button w-100 delete-btn">
              Delete account
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default EditProfile;
