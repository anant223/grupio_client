import {useParams } from "react-router-dom";
import ProfilePage from "@/profile/ProfilePage";


const UserProfile = () => {
  const {id} = useParams()
  return (
    <ProfilePage id={id}/>
  );
};

export default UserProfile;