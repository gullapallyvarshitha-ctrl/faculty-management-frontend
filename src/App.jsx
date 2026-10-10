import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import FacultyList from './components/FacultyList';
import FacultyModal from './components/FacultyModal';
import FacultyProfileModal from './components/FacultyProfileModal';
import DepartmentModal from './components/DepartmentModal';
import LoginModal from './components/LoginModal';
import Toast from './components/Toast';
import { api } from './api';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);

  // Data states
  const [dashboardStats, setDashboardStats] = useState(null);
  const [facultyList, setFacultyList] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDesig, setSelectedDesig] = useState('');

  // Loading states
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingFaculty, setLoadingFaculty] = useState(false);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [savingFaculty, setSavingFaculty] = useState(false);
  const [savingDept, setSavingDept] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  // Modal states
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [facultyToEdit, setFacultyToEdit] = useState(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [facultyToView, setFacultyToView] = useState(null);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  // Initial user check
  useEffect(() => {
    const savedUser = api.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  // Fetch Dashboard Statistics
  const loadDashboardStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const data = await api.getDashboardStats();
      setDashboardStats(data);
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Fetch Departments
  const loadDepartments = useCallback(async () => {
    setLoadingDepts(true);
    try {
      const data = await api.getDepartments();
      setDepartments(data || []);
    } catch (err) {
      console.error('Failed to load departments:', err);
    } finally {
      setLoadingDepts(false);
    }
  }, []);

  // Fetch Faculty List with filters
  const loadFaculty = useCallback(async () => {
    setLoadingFaculty(true);
    try {
      const data = await api.getFaculty({
        query: searchQuery,
        department: selectedDept,
        designation: selectedDesig
      });
      setFacultyList(data || []);
    } catch (err) {
      showToast('error', `Failed to load faculty: ${err.message}`);
    } finally {
      setLoadingFaculty(false);
    }
  }, [searchQuery, selectedDept, selectedDesig]);

  // Initial load
  useEffect(() => {
    loadDashboardStats();
    loadDepartments();
  }, [loadDashboardStats, loadDepartments]);

  // Load faculty whenever filters change
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadFaculty();
    }, 200);
    return () => clearTimeout(timeout);
  }, [loadFaculty]);

  // Handlers
  const handleLogin = async (email, password) => {
    setLoggingIn(true);
    try {
      const data = await api.login(email, password);
      setUser({
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        role: data.role
      });
      setIsLoginModalOpen(false);
      showToast('success', `Welcome back, ${data.fullName || data.email}! Admin session active.`);
      loadDashboardStats();
      loadFaculty();
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    showToast('info', 'Logged out. Switched to public guest mode.');
  };

  const checkAuthOrPrompt = () => {
    if (!user) {
      showToast('info', 'Please sign in with administrator credentials to modify records.');
      setIsLoginModalOpen(true);
      return false;
    }
    return true;
  };

  const handleOpenAddFaculty = () => {
    if (!checkAuthOrPrompt()) return;
    setFacultyToEdit(null);
    setIsFacultyModalOpen(true);
  };

  const handleEditFaculty = (faculty) => {
    if (!checkAuthOrPrompt()) return;
    setFacultyToEdit(faculty);
    setIsFacultyModalOpen(true);
  };

  const handleViewProfile = (faculty) => {
    setFacultyToView(faculty);
    setIsProfileModalOpen(true);
  };

  const handleSaveFaculty = async (formData) => {
    if (!checkAuthOrPrompt()) return;
    setSavingFaculty(true);
    try {
      if (facultyToEdit) {
        await api.updateFaculty(facultyToEdit.id, formData);
        showToast('success', `Faculty record for ${formData.name} updated successfully.`);
      } else {
        await api.createFaculty(formData);
        showToast('success', `Faculty record for ${formData.name} created successfully.`);
      }
      setIsFacultyModalOpen(false);
      setFacultyToEdit(null);
      loadFaculty();
      loadDashboardStats();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSavingFaculty(false);
    }
  };

  const handleDeleteFaculty = async (id) => {
    if (!checkAuthOrPrompt()) return;
    try {
      await api.deleteFaculty(id);
      showToast('success', 'Faculty record deleted successfully.');
      loadFaculty();
      loadDashboardStats();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const handleAddDepartment = async (deptData, callback) => {
    if (!checkAuthOrPrompt()) return;
    setSavingDept(true);
    try {
      await api.createDepartment(deptData);
      showToast('success', `Department '${deptData.name}' created.`);
      loadDepartments();
      loadDashboardStats();
      if (callback) callback();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSavingDept(false);
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (!checkAuthOrPrompt()) return;
    try {
      await api.deleteDepartment(id);
      showToast('success', 'Department deleted.');
      loadDepartments();
      loadDashboardStats();
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDept('');
    setSelectedDesig('');
  };

  return (
    <div className="app-layout">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Body */}
      <main className="main-content-area">
        {activeTab === 'dashboard' && (
          <Dashboard
            stats={dashboardStats}
            loading={loadingStats}
            onRefresh={() => {
              loadDashboardStats();
              loadFaculty();
              showToast('info', 'University statistics refreshed.');
            }}
            onAddFaculty={handleOpenAddFaculty}
            onAddDepartment={() => setActiveTab('departments')}
            onViewFaculty={() => setActiveTab('faculty')}
            onViewProfile={handleViewProfile}
          />
        )}

        {activeTab === 'faculty' && (
          <FacultyList
            facultyList={facultyList}
            departments={departments}
            loading={loadingFaculty}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedDept={selectedDept}
            setSelectedDept={setSelectedDept}
            selectedDesig={selectedDesig}
            setSelectedDesig={setSelectedDesig}
            onResetFilters={handleResetFilters}
            onAddFaculty={handleOpenAddFaculty}
            onViewProfile={handleViewProfile}
            onEditFaculty={handleEditFaculty}
            onDeleteFaculty={handleDeleteFaculty}
            user={user}
          />
        )}

        {activeTab === 'departments' && (
          <DepartmentModal
            departments={departments}
            onAddDepartment={handleAddDepartment}
            onDeleteDepartment={handleDeleteDepartment}
            user={user}
            saving={savingDept}
          />
        )}
      </main>

      {/* Modals & Dialogs */}
      <FacultyModal
        isOpen={isFacultyModalOpen}
        onClose={() => setIsFacultyModalOpen(false)}
        onSave={handleSaveFaculty}
        facultyToEdit={facultyToEdit}
        departments={departments}
        saving={savingFaculty}
      />

      <FacultyProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        faculty={facultyToView}
        onEdit={handleEditFaculty}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        loading={loggingIn}
      />

      {/* Global Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
