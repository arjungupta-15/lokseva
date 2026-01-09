import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { API_URL } from "../api";
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Complaints() {
  const [issues, setIssues] = useState([]);
  const nav = useNavigate();

  const loadIssues = async () => {
    const res = await fetch(`${API_URL}/admin/issues`);
    setIssues(await res.json());
  };

  useEffect(() => {
    loadIssues();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1 }}>
        <Topbar />

        <Box sx={{ p: 3 }}>
          <h2>All Complaints</h2>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {issues.map((i) => (
                <TableRow key={i._id}>
                  <TableCell>{i.category}</TableCell>
                  <TableCell>{i.location}</TableCell>
                  <TableCell>{i.priority}</TableCell>
                  <TableCell>{i.status}</TableCell>

                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => nav(`/complaints/${i._id}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}
