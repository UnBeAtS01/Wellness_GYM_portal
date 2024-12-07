import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { LocalizationProvider } from "@mui/x-date-pickers";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  TablePagination,
  TableSortLabel,
  Grid,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import emailjs from "@emailjs/browser";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const GymMembers = () => {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    startDate: null,
    endDate: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [sortOrder, setSortOrder] = useState("asc"); // Sorting order: 'asc' or 'desc'
  // Filter members based on the search query
  useEffect(() => {
    const filtered = members.filter((member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredMembers(filtered);
  }, [searchQuery, members]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const membersCollectionRef = collection(db, "gym_members");

  // Fetch members
  const fetchMembers = async () => {
    const data = await getDocs(membersCollectionRef);
    setMembers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Add new member
  const addMember = async () => {
    if (
      newMember.startDate &&
      newMember.endDate &&
      isValidEmail(newMember.email) &&
      newMember.name
    ) {
      await addDoc(membersCollectionRef, newMember);
      fetchMembers();
      setNewMember({ name: "", email: "", startDate: null, endDate: null });
    } else {
      alert("Please fill all fields correctly!");
    }
  };

  // Send email
  const sendReminderEmail = (member) => {
    const message = `Hi ${member.name}, your gym subscription is about to end on ${dayjs(
      member.endDate.toDate(),
    ).format("YYYY-MM-DD")}.`;

    emailjs
      .send(
        "service_qwo92t4",
        "template_qb3ifv2",
        {
          to_email: member.email,
          message: message,
        },
        "R_DQ0wEEOOo1UuPjb",
      )
      .then(
        (result) => {
          alert("Email sent successfully!");
        },
        (error) => {
          console.error("Error sending email:", error.text);
        },
      );
  };
  const sortMembersByName = () => {
    const sorted = [...filteredMembers].sort((a, b) => {
      const nameA = a.name;
      const nameB = b.name;
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
    setFilteredMembers(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle sort order
  };
  const sortMembersByEndDate = () => {
    const sorted = [...filteredMembers].sort((a, b) => {
      const dateA = a.endDate.toDate();
      const dateB = b.endDate.toDate();
      return sortOrder === "asc"
        ? dateA - dateB // Ascending order
        : dateB - dateA; // Descending order
    });

    setFilteredMembers(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle sort order
  };
  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <Box
      sx={{
        padding: 4,
        background: "rgba(255, 255, 255, 0.25)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)", // Safari compatibility
        borderRadius: "10px",
      }}
    >
      <Typography sx={{ color: "white" }} variant="h4" gutterBottom>
        Gym Members
      </Typography>
      <Box
        component={Paper}
        elevation={3}
        sx={{ padding: 3, marginBottom: 4, background: "transparent" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Name"
              fullWidth
              value={newMember.name}
              onChange={(e) =>
                setNewMember({ ...newMember, name: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Email"
              fullWidth
              value={newMember.email}
              onChange={(e) =>
                setNewMember({ ...newMember, email: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={
                  newMember.startDate
                    ? dayjs(newMember.startDate.toDate())
                    : null
                }
                onChange={(date) =>
                  setNewMember({
                    ...newMember,
                    startDate: Timestamp.fromDate(date.toDate()),
                  })
                }
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                value={
                  newMember.endDate ? dayjs(newMember.endDate.toDate()) : null
                }
                onChange={(date) =>
                  setNewMember({
                    ...newMember,
                    endDate: Timestamp.fromDate(date.toDate()),
                  })
                }
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={addMember}
              variant="contained"
              sx={{
                backgroundColor: "var(--orange)",
                "&:hover": {
                  backgroundColor: "#e68900", // Slightly darker orange for hover effect
                },
              }}
              fullWidth
            >
              Add Member
            </Button>
          </Grid>
        </Grid>
      </Box>
      <TextField
        label="Search by Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "var(--orange)" }}>
                <TableSortLabel
                  active
                  direction={sortOrder}
                  onClick={sortMembersByName}
                  sx={{ color: "var(--orange) !important" }}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: "var(--orange)" }}>Email</TableCell>
              <TableCell sx={{ color: "var(--orange)" }}>Start Date</TableCell>
              <TableCell sx={{ color: "var(--orange)" }}>
                {/* Sortable End Date */}
                <TableSortLabel
                  active
                  direction={sortOrder}
                  onClick={sortMembersByEndDate}
                  sx={{ color: "var(--orange) !important" }}
                >
                  End Date
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: "var(--orange)" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    {dayjs(member.startDate.toDate()).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>
                    {dayjs(member.endDate.toDate()).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => sendReminderEmail(member)}
                    >
                      Send Reminder
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredMembers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15, 20]}
      />
    </Box>
  );
};

export default GymMembers;
