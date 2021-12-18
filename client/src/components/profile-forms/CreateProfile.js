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
import { setAlert } from "../../store/alert/alert-actions";
import { uiActions } from "../../store/ui/ui-slice";

import Hourglass from "../layout/Hourglass";

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

    if (interests.current.value === "") {
      dispatch(setAlert("Please fill in interests field", "danger"));
      return;
    }

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

  if (loading)
    return (
      <div className="center">
        <Hourglass />
      </div>
    );

  return (
    <main className="px-3 pt-7-5">
      <div className="pre-auth-container">
        <form onSubmit={onSubmit} className="form">
          <div className="form-group">
            <label htmlFor="highschool">Highschool</label>
            <input
              ref={highschool}
              type="text"
              placeholder="Highschool"
              name="highschool"
            />
          </div>
          <div className="form-group">
            <label htmlFor="college">College</label>
            <input
              ref={college}
              type="text"
              placeholder="College"
              name="college"
            />
          </div>
          <div className="form-group">
            <label htmlFor="job">Job</label>
            <input ref={job} type="text" placeholder="Job" name="job" />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              ref={location}
              type="text"
              placeholder="Location"
              name="location"
            />
          </div>
          <div className="form-group">
            <label htmlFor="relationshipstatus">Relationship Status</label>
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
            <label htmlFor="interests">Interests</label>
            <input
              ref={interests}
              type="text"
              placeholder="Interests"
              name="interests"
            />
          </div>
          <div className="form-group mb-2">
            <label htmlFor="bio">Short Bio</label>
            <textarea
              ref={bio}
              placeholder="A short bio of yourself"
              name="bio"
              maxLength="300"
              rows="4"
            ></textarea>
          </div>
          <button className="link-button w-100 mb-2 btn-success">Submit</button>

          <hr />
        </form>
        <Link
          className="link-button w-100 bg-black white mb-05"
          to={`/newsfeed`}
        >
          Go Back
        </Link>
        <button
          className="link-button mt-1 w-100 alert-danger"
          onClick={onDelete}
        >
          Delete Account
        </button>
      </div>

      <div className="disclaimer"></div>
    </main>
  );
};

export default CreateProfile;
