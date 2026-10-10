import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, RolePermissions } from '../types';
import { INITIAL_USERS, DEFAULT_ROLE_PERMISSIONS } from '../data/initialData';

interface AuthContextType {
  currentUser: User;
  users: User[];
  allRoles: { role: UserRole; title: string; desc: string; icon: string }[];
  isAuthenticated: boolean;
  isLocked: boolean;
  twoFactorRequired: boolean;
  sessionRemainingSeconds: number;
  googleProfile: {
    email: string;
    name: string;
    avatarUrl?: string;
    role: UserRole;
  } | null;
  switchRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;
  login: (email: string, pass: string, twoFactorCode?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (role: UserRole, customProfile?: { name: string; email: string; avatarUrl?: string }) => void;
  quickPortalLogin: (role: UserRole) => void;
  logout: () => void;
  lockSession: () => void;
  unlockSession: (pass: string) => boolean;
  toggleTwoFactor: (enable: boolean) => void;
  hasPermission: (permissionKey: keyof RolePermissions) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const ROLE_DEFINITIONS: { role: UserRole; title: string; desc: string; icon: string }[] = [
  {
    role: 'super_admin',
    title: 'Super Admin Portal',
    desc: 'Full administrative access, staff directory, audit trails & permissions',
    icon: 'ShieldAlert',
  },
  {
    role: 'doctor',
    title: 'Doctor / Physician Portal',
    desc: 'EMR timeline, diagnoses, consultations, e-prescriptions & lab ordering',
    icon: 'Stethoscope',
  },
  {
    role: 'nurse',
    title: 'Inpatient Nursing Portal',
    desc: 'Bed allocations, vitals entry, medication administration & nursing notes',
    icon: 'Activity',
  },
  {
    role: 'receptionist',
    title: 'Receptionist & Intake Portal',
    desc: 'Patient registration, appointment desk, queue management & admissions',
    icon: 'UserPlus',
  },
  {
    role: 'lab_tech',
    title: 'Laboratory Technologist Portal',
    desc: 'Specimen tracking, test result entry, reference ranges & report verification',
    icon: 'Microscope',
  },
  {
    role: 'pharmacist',
    title: 'Clinical Pharmacist Portal',
    desc: 'e-Prescriptions queue, allergy checks, dispensing & medicine inventory',
    icon: 'Pill',
  },
  {
    role: 'patient',
    title: 'Patient Health Portal',
    desc: 'Personal digital health record, lab results, prescriptions & booking',
    icon: 'HeartHandshake',
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const local = localStorage.getItem('hprms_users');
    if (!local) return INITIAL_USERS;
    try {
      const parsed: User[] = JSON.parse(local);
      // Merge with INITIAL_USERS to ensure all username and password properties are populated
      return INITIAL_USERS.map((initUser) => {
        const found = parsed.find((u) => u.id === initUser.id);
        if (!found) return initUser;
        return {
          ...initUser,
          ...found,
          username: initUser.username,
          password: initUser.password,
        };
      });
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const local = localStorage.getItem('hprms_current_user');
    return local ? JSON.parse(local) : INITIAL_USERS[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const local = localStorage.getItem('hprms_is_authenticated');
    return local === 'true';
  });

  const [googleProfile, setGoogleProfile] = useState<{
    email: string;
    name: string;
    avatarUrl?: string;
    role: UserRole;
  } | null>(() => {
    const local = localStorage.getItem('hprms_google_profile');
    return local ? JSON.parse(local) : null;
  });

  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState<boolean>(false);
  const [sessionRemainingSeconds, setSessionRemainingSeconds] = useState<number>(900); // 15 mins default

  useEffect(() => {
    localStorage.setItem('hprms_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('hprms_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('hprms_is_authenticated', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    if (googleProfile) {
      localStorage.setItem('hprms_google_profile', JSON.stringify(googleProfile));
    } else {
      localStorage.removeItem('hprms_google_profile');
    }
  }, [googleProfile]);

  // Session activity timer
  useEffect(() => {
    if (isLocked || !isAuthenticated) return;

    const timer = setInterval(() => {
      setSessionRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsLocked(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked, isAuthenticated]);

  // Reset timer on user clicks
  useEffect(() => {
    const resetTimer = () => {
      if (!isLocked && isAuthenticated) {
        setSessionRemainingSeconds(900);
      }
    };
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [isLocked, isAuthenticated]);

  const getRoleMetadata = (role: UserRole) => {
    switch (role) {
      case 'doctor':
        return { department: 'Cardiology & Internal Medicine', specialty: 'Attending Physician & Clinical Specialist', licenseNumber: 'SRM-MD-9041' };
      case 'nurse':
        return { department: 'Inpatient Cardiology & ICU', specialty: 'Critical Care Registered Nurse (CCRN)', licenseNumber: 'SRM-RN-5120' };
      case 'receptionist':
        return { department: 'Front Desk & Patient Admissions', specialty: 'Patient Registration & Intake Lead' };
      case 'lab_tech':
        return { department: 'Pathology & Diagnostic Laboratory', specialty: 'Clinical Laboratory Scientist', licenseNumber: 'SRM-MLS-3319' };
      case 'pharmacist':
        return { department: 'Central Inpatient Pharmacy', specialty: 'Chief Pharmacotherapy Specialist', licenseNumber: 'SRM-RPH-4109' };
      case 'patient':
        return { department: 'Outpatient Care', specialty: 'Patient Health Portal User' };
      case 'super_admin':
      default:
        return { department: 'Hospital Administration', specialty: 'Chief Medical Officer & System Admin', licenseNumber: 'SRM-ADM-2026' };
    }
  };

  const loginWithGoogle = (role: UserRole, customProfile?: { name: string; email: string; avatarUrl?: string }) => {
    const email = customProfile?.email || 'vabhinand2007@gmail.com';
    const name = customProfile?.name || (role === 'doctor' ? 'Dr. Abhinand V, MD' : 'Abhinand V');
    const avatarUrl = customProfile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`;

    const newProfile = { email, name, avatarUrl, role };
    setGoogleProfile(newProfile);

    const meta = getRoleMetadata(role);
    const googleUser: User = {
      id: `usr-google-${role}`,
      name,
      email,
      role,
      avatarUrl,
      department: meta.department,
      specialty: meta.specialty,
      licenseNumber: meta.licenseNumber,
      phone: '+1 (555) 019-2007',
      isActive: true,
      twoFactorEnabled: false,
      associatedPatientId: role === 'patient' ? 'pat-001' : undefined,
      isGoogleAuth: true,
      googleEmail: email,
    };

    setCurrentUser(googleUser);
    setIsAuthenticated(true);
    setIsLocked(false);
    setTwoFactorRequired(false);
    setSessionRemainingSeconds(900);
    localStorage.setItem('hprms_is_authenticated', 'true');
    localStorage.setItem('hprms_current_user', JSON.stringify(googleUser));
  };

  const quickPortalLogin = (role: UserRole) => {
    const targetUser = users.find((u) => u.role === role) || users[0];
    setCurrentUser(targetUser);
    setGoogleProfile(null);
    setIsAuthenticated(true);
    setIsLocked(false);
    setTwoFactorRequired(false);
    setSessionRemainingSeconds(900);
    localStorage.setItem('hprms_is_authenticated', 'true');
    localStorage.setItem('hprms_current_user', JSON.stringify(targetUser));
  };

  const switchRole = (role: UserRole) => {
    if (currentUser.isGoogleAuth && googleProfile) {
      // Retain Google identity, just change role portal
      const meta = getRoleMetadata(role);
      const updatedUser: User = {
        ...currentUser,
        id: `usr-google-${role}`,
        role,
        department: meta.department,
        specialty: meta.specialty,
        licenseNumber: meta.licenseNumber,
        associatedPatientId: role === 'patient' ? 'pat-001' : undefined,
      };
      setCurrentUser(updatedUser);
      setGoogleProfile({ ...googleProfile, role });
    } else {
      const targetUser = users.find((u) => u.role === role) || users[0];
      setCurrentUser(targetUser);
    }
    setIsLocked(false);
    setSessionRemainingSeconds(900);
  };

  const switchUser = (userId: string) => {
    const targetUser = users.find((u) => u.id === userId);
    if (targetUser) {
      setCurrentUser(targetUser);
      setIsLocked(false);
      setSessionRemainingSeconds(900);
    }
  };

  const login = async (
    identifier: string,
    pass: string,
    twoFactorCode?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanId = identifier.trim().toLowerCase();
    // Allow lookup by username or email
    const user = users.find(
      (u) =>
        (u.username && u.username.toLowerCase() === cleanId) ||
        u.email.toLowerCase() === cleanId
    );
    if (!user) {
      return { success: false, error: 'User not found. Enter a valid Username or Institutional Email.' };
    }
    if (!user.isActive) {
      return { success: false, error: 'This account has been deactivated by the Hospital Administrator.' };
    }

    // Verify password: check user-specific password or fallback to standard institutional password
    const expectedPassword = user.password || 'hospital123';
    if (pass !== expectedPassword && pass !== 'hospital123') {
      return {
        success: false,
        error: `Incorrect password for @${user.username || user.email}. (Default: ${user.password || 'hospital123'})`,
      };
    }

    if (user.twoFactorEnabled && !twoFactorCode) {
      setTwoFactorRequired(true);
      return { success: false, error: '2-Factor Authentication code required for this account.' };
    }
    if (user.twoFactorEnabled && twoFactorCode && twoFactorCode !== '123456' && twoFactorCode.length !== 6) {
      return { success: false, error: 'Invalid 2FA verification token. Enter valid 6-digit passcode (or test: 123456).' };
    }

    setCurrentUser(user);
    setGoogleProfile(null);
    setIsAuthenticated(true);
    setIsLocked(false);
    setTwoFactorRequired(false);
    setSessionRemainingSeconds(900);
    localStorage.setItem('hprms_is_authenticated', 'true');
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsLocked(false);
    setGoogleProfile(null);
    localStorage.setItem('hprms_is_authenticated', 'false');
    localStorage.removeItem('hprms_google_profile');
  };

  const lockSession = () => {
    setIsLocked(true);
  };

  const unlockSession = (pass: string): boolean => {
    if (pass.length > 0) {
      setIsLocked(false);
      setSessionRemainingSeconds(900);
      return true;
    }
    return false;
  };

  const toggleTwoFactor = (enable: boolean) => {
    setCurrentUser((prev) => ({ ...prev, twoFactorEnabled: enable }));
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? { ...u, twoFactorEnabled: enable } : u)));
  };

  const hasPermission = (permissionKey: keyof RolePermissions): boolean => {
    const rolePerms = DEFAULT_ROLE_PERMISSIONS[currentUser.role];
    return rolePerms ? !!rolePerms[permissionKey] : false;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        allRoles: ROLE_DEFINITIONS,
        isAuthenticated,
        isLocked,
        twoFactorRequired,
        sessionRemainingSeconds,
        googleProfile,
        switchRole,
        switchUser,
        login,
        loginWithGoogle,
        quickPortalLogin,
        logout,
        lockSession,
        unlockSession,
        toggleTwoFactor,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
