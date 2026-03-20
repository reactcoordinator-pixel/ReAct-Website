"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Divider,
} from "@heroui/react";
import RootLayout from "@/components/RootLayout";
import { Eye, EyeOff, UserPlus, Edit, Trash2 } from "lucide-react";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/pages/api/FirebaseConfig"; // Adjust path if your firebase config file is elsewhere

interface Admin {
  id: string;
  name: string;
  username: string;
  email: string;
  jobRole: string;
  // password is stored but NEVER displayed in the list for security
}

const UsersPage: React.FC = () => {
  const initForm = {
    name: "",
    username: "",
    email: "",
    password: "",
    jobRole: "",
  };

  const [formData, setFormData] = useState(initForm);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "admins"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Admin[];
      setAdmins(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.username ||
      !formData.email ||
      (!editingId && !formData.password)
    ) {
      alert("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const data: any = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        jobRole: formData.jobRole,
      };

      if (formData.password) {
        data.password = formData.password;
      }

      if (editingId) {
        await updateDoc(doc(db, "admins", editingId), data);
        setEditingId(null);
      } else {
        await addDoc(collection(db, "admins"), {
          ...data,
          password: formData.password, // required for new admin
        });
      }

      setFormData(initForm);
    } catch (err) {
      console.error(err);
      alert("Error saving admin");
    }
    setSubmitting(false);
  };

  const handleEdit = (admin: Admin) => {
    setFormData({
      name: admin.name,
      username: admin.username,
      email: admin.email,
      jobRole: admin.jobRole || "",
      password: "",
    });
    setEditingId(admin.id);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(initForm);
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this admin? This cannot be undone.",
      )
    ) {
      try {
        await deleteDoc(doc(db, "admins", id));
      } catch (err) {
        console.error(err);
        alert("Error deleting admin");
      }
    }
  };

  return (
    <RootLayout>
      <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-yellow-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#f8cf2c] to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                  Manage Admins
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Add, edit, or remove admin profiles for CMS access
                </p>
              </div>
            </div>
          </div>

          {/* Add/Edit Form */}
          <Card className="mb-10 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {editingId ? "Edit Admin" : "Add New Admin"}
              </h2>
            </CardHeader>
            <Divider />
            <CardBody>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Name"
                    name="name"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={handleChange}
                    isRequired
                    variant="bordered"
                    size="lg"
                  />
                  <Input
                    label="Username"
                    name="username"
                    placeholder="Login username"
                    value={formData.username}
                    onChange={handleChange}
                    isRequired
                    variant="bordered"
                    size="lg"
                  />
                  <Input
                    type="email"
                    label="Email"
                    name="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    isRequired
                    variant="bordered"
                    size="lg"
                  />
                  <Input
                    label="Job Role"
                    name="jobRole"
                    placeholder="e.g., Content Manager"
                    value={formData.jobRole}
                    onChange={handleChange}
                    variant="bordered"
                    size="lg"
                  />
                </div>

                <Input
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  name="password"
                  placeholder={
                    editingId ? "Leave blank to keep current" : "Enter password"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  isRequired={!editingId}
                  variant="bordered"
                  size="lg"
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  }
                />

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    isLoading={submitting}
                    className="bg-[#f8cf2c] hover:bg-[#e6c028] text-white font-semibold shadow-lg"
                    size="lg"
                  >
                    {editingId ? "Update Admin" : "Add Admin"}
                  </Button>
                  {editingId && (
                    <Button onClick={handleCancel} variant="bordered" size="lg">
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardBody>
          </Card>

          {/* Admins List */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner size="lg" color="warning" />
            </div>
          ) : admins.length === 0 ? (
            <Card className="py-10 text-center">
              <CardBody>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No admins added yet. Create the first one above.
                </p>
              </CardBody>
            </Card>
          ) : (
            <Table aria-label="Admins table" className="shadow-xl">
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Username</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Job Role</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>{admin.name}</TableCell>
                    <TableCell>{admin.username}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.jobRole || "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          startContent={<Edit className="w-4 h-4" />}
                          onClick={() => handleEdit(admin)}
                          className="bg-[#f8cf2c] text-white"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          variant="flat"
                          startContent={<Trash2 className="w-4 h-4" />}
                          onClick={() => handleDelete(admin.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </RootLayout>
  );
};

export default UsersPage;
