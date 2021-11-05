import React, { useEffect, useRef } from "react";
import { Link, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import {
  createProfile,
  getCurrentProfile,
  deleteAccount,
} from "../../store/profile/profile-actions";
import { loadUser } from "../../store/auth/auth-actions";

const CreateProfile = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  let history = useHistory();

  const highschool = useRef();
  const college = useRef();
  const job = useRef();
  const location = useRef();
  const relationshipStatus = useRef();
  const interests = useRef();
  const bio = useRef();

  useEffect(() => {
    dispatch(getCurrentProfile());
  }, [dispatch]);

  const onSubmit = (e) => {
    e.preventDefault();

    const formData = {
      highschool: highschool.current.value,
      college: college.current.value,
      job: job.current.value,
      location: location.current.value,
      relationshipstatus: relationshipStatus.current.value,
      interests: interests.current.value,
      bio: bio.current.value,
    };

    const userId = user.payload._id;
    dispatch(createProfile(formData, history, false, userId));
    dispatch(loadUser());
  };

  const onDelete = () => {
    dispatch(deleteAccount());
  };

  if (profile && !loading) {
    return <Redirect to="/edit-profile" />;
  }

  if (loading) return <h1 className="p-1 mt-2">Loading...</h1>;

  return (
    <main className="registerlogin-container">
      <div className="registerlogin maxw-40">
        <div>
          <h1 className="large text-primary">Create Your Profile</h1>
          <p className="lead mb-2">
            Let's get some information to make your profile stand out
          </p>
          <form onSubmit={onSubmit} className="form">
            <div className="form-group">
              <input
                ref={highschool}
                type="text"
                placeholder="Highschool"
                name="highschool"
              />
            </div>
            <div className="form-group">
              <input
                ref={college}
                type="text"
                placeholder="College"
                name="college"
              />
            </div>
            <div className="form-group">
              <input ref={job} type="text" placeholder="Job" name="job" />
            </div>
            <div className="form-group">
              <input
                ref={location}
                type="text"
                placeholder="Location"
                name="location"
              />
            </div>
            <div className="form-group">
              <select ref={relationshipStatus} name="relationshipstatus">
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
                ref={interests}
                type="text"
                placeholder="Interests"
                name="interests"
              />
            </div>
            <div className="form-group">
              <textarea
                ref={bio}
                placeholder="A short bio of yourself"
                name="bio"
                maxLength="300"
                rows="1"
              ></textarea>
            </div>
            <button className="link-button w-100 mb-1 invert">Submit</button>
            <Link className="link-button mb-2" to="/newsfeed">
              Go Back
            </Link>
          </form>
          <button onClick={onDelete} className="link-button w-100 delete-btn">
            Delete account
          </button>
        </div>
      </div>
    </main>
  );
};

export default CreateProfile;
