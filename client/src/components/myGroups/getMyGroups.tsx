import { useEffect } from "react";
import axios from "axios";
import { MyGroupsTypes } from "./types";

interface GetMyGroupsProps {
  onGroupsFetched: (groups: MyGroupsTypes[]) => void;
}

const GetMyGroups = ({ onGroupsFetched }: GetMyGroupsProps) => {
  useEffect(() => {
    const fetchMyGroups = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getMyGroups", {
          withCredentials: true,
        });
        onGroupsFetched(response.data.groups);
      } catch (error) {
        console.error("Error fetching your groups:", error);
      }
    };

    fetchMyGroups();
  }, [onGroupsFetched]);

  return null;
};

export default GetMyGroups;