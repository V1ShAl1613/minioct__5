import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth, testConnection } from '../firebase/config.ts';
import type { UserProfile, UserRole } from '../types/index.ts';
import { DEMO_STUDENT } from '../firebase/seedData.ts';
import {
  getUserProfile,
  saveUserProfile,
  initializeDatabaseIfEmpty,
} from '../services/firebaseService.ts';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isDemoMode: boolean;
  profileCompleteness: number;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginAsDemoStudent: () => void;
  loginAsDemoAdmin: () => void;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Initialize DB and connection check
  useEffect(() => {
    testConnection();
    initializeDatabaseIfEmpty();
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        setCurrentUser(user);
        setIsDemoMode(false);
        // Load profile from Firestore or local storage
        let profile = await getUserProfile(user.uid);
        if (!profile) {
          // Initialize a fresh student profile
          profile = {
            id: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'Student',
            email: user.email || '',
            photoURL: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
            role: user.email === 'vish1603v@gmail.com' ? 'admin' : 'student',
            skills: ['Python', 'Problem Solving'],
            interests: ['Technology', 'Internships'],
            careerGoals: ['Software Engineer'],
            preferences: {
              workModes: ['Remote', 'Hybrid'],
              opportunityTypes: ['Internship', 'Hackathon'],
            },
            createdAt: new Date().toISOString(),
          };
          await saveUserProfile(profile);
          setShowOnboarding(true);
        }
        setUserProfile(profile);
      } else {
        // If not logged into Firebase and no active demo student, check local storage
        const savedDemo = localStorage.getItem('campusconnect_active_demo');
        if (savedDemo === 'true') {
          const profile = (await getUserProfile(DEMO_STUDENT.id)) || DEMO_STUDENT;
          setUserProfile(profile);
          setIsDemoMode(true);
        } else if (savedDemo === 'admin') {
          setUserProfile({
            id: 'demo-admin-id',
            name: 'Campus Admin',
            email: 'vish1603v@gmail.com',
            photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
            role: 'admin',
            skills: ['Administration', 'Mentorship'],
            interests: ['Education', 'Placements'],
            careerGoals: ['Dean of Academic Affairs'],
            preferences: {},
          });
          setIsDemoMode(true);
        } else {
          // Default to demo student so app works out of the box per prompt section 26:
          // "The complete demo should be possible without requiring manual database population"
          setUserProfile(DEMO_STUDENT);
          setIsDemoMode(true);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Calculate profile completeness score
  const profileCompleteness = useMemo(() => {
    if (!userProfile) return 0;
    let score = 0;
    if (userProfile.name) score += 10;
    if (userProfile.email) score += 10;
    if (userProfile.college) score += 15;
    if (userProfile.department) score += 15;
    if (userProfile.year) score += 10;
    if (userProfile.skills && userProfile.skills.length >= 3) score += 20;
    else if (userProfile.skills && userProfile.skills.length > 0) score += 10;
    if (userProfile.interests && userProfile.interests.length >= 2) score += 10;
    if (userProfile.careerGoals && userProfile.careerGoals.length >= 1) score += 10;
    return Math.min(100, score);
  }, [userProfile]);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      localStorage.removeItem('campusconnect_active_demo');
    } catch (error) {
      console.error('Google Sign In Error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      localStorage.removeItem('campusconnect_active_demo');
    } catch (error) {
      console.error('Email Sign In Error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const newProfile: UserProfile = {
        id: cred.user.uid,
        name,
        email,
        role: email === 'vish1603v@gmail.com' ? 'admin' : 'student',
        skills: [],
        interests: [],
        careerGoals: [],
        preferences: {},
        createdAt: new Date().toISOString(),
      };
      await saveUserProfile(newProfile);
      setUserProfile(newProfile);
      setShowOnboarding(true);
      localStorage.removeItem('campusconnect_active_demo');
    } catch (error) {
      console.error('Sign Up Error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemoStudent = () => {
    localStorage.setItem('campusconnect_active_demo', 'true');
    setIsDemoMode(true);
    setUserProfile(DEMO_STUDENT);
  };

  const loginAsDemoAdmin = () => {
    localStorage.setItem('campusconnect_active_demo', 'admin');
    setIsDemoMode(true);
    setUserProfile({
      id: 'demo-admin-id',
      name: 'Dr. Michael Vance (Admin)',
      email: 'vish1603v@gmail.com',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      role: 'admin',
      college: 'National Institute of Technology',
      department: 'Dean of Student Placements',
      skills: ['Opportunity Curation', 'Mentorship'],
      interests: ['Campus Hiring', 'Hackathons'],
      careerGoals: ['Institutional Excellence'],
      preferences: {},
    });
  };

  const logout = async () => {
    localStorage.removeItem('campusconnect_active_demo');
    setIsDemoMode(false);
    setCurrentUser(null);
    setUserProfile(null);
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    if (!userProfile) return;
    const merged: UserProfile = { ...userProfile, ...updated, updatedAt: new Date().toISOString() };
    setUserProfile(merged);
    await saveUserProfile(merged);
  };

  const switchRole = (role: UserRole) => {
    if (!userProfile) return;
    updateProfile({ role });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isLoading,
        isDemoMode,
        profileCompleteness,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        loginAsDemoStudent,
        loginAsDemoAdmin,
        logout,
        updateProfile,
        showOnboarding,
        setShowOnboarding,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
