import React, { createContext, useEffect, useState } from 'react';
import app from '../assets/Firebase/firebase.config';
import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth";

export const AuthContext = createContext();
const auth = getAuth(app);


const AuthProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const key = user ? `wishlist_${user.email}` : 'wishlist_guest';
        const savedWishlist = localStorage.getItem(key);
        setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
    }, [user]);

    useEffect(() => {
        if (user || !loading) {
            const key = user ? `wishlist_${user.email}` : 'wishlist_guest';
            localStorage.setItem(key, JSON.stringify(wishlist));
        }
    }, [wishlist, user, loading]);

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const resetPassword = (email) => {
        setLoading(true);
        return sendPasswordResetEmail(auth, email)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        })
        return () => {
            unsubscribe();
        }
    }, [])

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    }

    const manageUserProfile = (name, photo, phone) => {
        setLoading(true);
        // Update Firebase profile
        updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo
        });

        // Save phone and other details to localStorage
        if (user?.email) {
            const userProfile = {
                email: user.email,
                phone: phone || '',
                name: name,
                memberSince: localStorage.getItem(`user_memberSince_${user.email}`) || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            };
            localStorage.setItem(`user_profile_${user.email}`, JSON.stringify(userProfile));
        }
    };

    // Get user profile data from localStorage
    const getUserProfile = () => {
        if (!user?.email) return null;
        const stored = localStorage.getItem(`user_profile_${user.email}`);
        return stored ? JSON.parse(stored) : null;
    };

    const authData = {
        user,
        loading,
        setUser,
        createUser,
        logOut,
        signInUser,
        cart,
        setCart,
        wishlist,
        setWishlist,
        resetPassword,
        manageUserProfile,
        getUserProfile
    }


    return (
        <AuthContext.Provider value={authData}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;