import React, { createContext, useEffect, useState } from 'react';
import app from '../assets/Firebase/firebase.config';
import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth";

export const AuthContext = createContext();
const auth = getAuth(app);


const AuthProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('cart_guest');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState(() => {
        try {
            const saved = localStorage.getItem('wishlist_guest');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });
    const [prevUserEmail, setPrevUserEmail] = useState(undefined);

    useEffect(() => {
        if (loading) return;

        const currentEmail = user ? user.email : null;
        if (currentEmail !== prevUserEmail) {
            try {
                if (user) {
                    // Merge guest cart into user cart
                    const guestCartStr = localStorage.getItem('cart_guest');
                    const guestCart = guestCartStr ? JSON.parse(guestCartStr) : [];

                    const userCartStr = localStorage.getItem(`cart_${user.email}`);
                    const userCart = userCartStr ? JSON.parse(userCartStr) : [];

                    let mergedCart = [...userCart];
                    if (guestCart.length > 0) {
                        guestCart.forEach(gItem => {
                            if (!mergedCart.some(uItem => uItem.id === gItem.id)) {
                                mergedCart.push(gItem);
                            }
                        });
                        localStorage.setItem(`cart_${user.email}`, JSON.stringify(mergedCart));
                        localStorage.removeItem('cart_guest');
                    }
                    setCart(mergedCart);

                    // Merge guest wishlist into user wishlist
                    const guestWishlistStr = localStorage.getItem('wishlist_guest');
                    const guestWishlist = guestWishlistStr ? JSON.parse(guestWishlistStr) : [];

                    const userWishlistStr = localStorage.getItem(`wishlist_${user.email}`);
                    const userWishlist = userWishlistStr ? JSON.parse(userWishlistStr) : [];

                    let mergedWishlist = [...userWishlist];
                    if (guestWishlist.length > 0) {
                        guestWishlist.forEach(gItem => {
                            if (!mergedWishlist.some(uItem => uItem.id === gItem.id)) {
                                mergedWishlist.push(gItem);
                            }
                        });
                        localStorage.setItem(`wishlist_${user.email}`, JSON.stringify(mergedWishlist));
                        localStorage.removeItem('wishlist_guest');
                    }
                    setWishlist(mergedWishlist);
                } else {
                    // Logged out: load guest cart and wishlist
                    const guestCartStr = localStorage.getItem('cart_guest');
                    setCart(guestCartStr ? JSON.parse(guestCartStr) : []);

                    const guestWishlistStr = localStorage.getItem('wishlist_guest');
                    setWishlist(guestWishlistStr ? JSON.parse(guestWishlistStr) : []);
                }
            } catch (e) {
                console.error("Error synchronizing localStorage with auth state:", e);
            }
            setPrevUserEmail(currentEmail);
        }
    }, [user, loading, prevUserEmail]);

    useEffect(() => {
        if (loading) return;
        const currentEmail = user ? user.email : null;
        if (currentEmail === prevUserEmail) {
            try {
                const key = user ? `cart_${user.email}` : 'cart_guest';
                localStorage.setItem(key, JSON.stringify(cart));
            } catch (e) {
                console.error("Error saving cart to localStorage:", e);
            }
        }
    }, [cart, user, loading, prevUserEmail]);

    useEffect(() => {
        if (loading) return;
        const currentEmail = user ? user.email : null;
        if (currentEmail === prevUserEmail) {
            try {
                const key = user ? `wishlist_${user.email}` : 'wishlist_guest';
                localStorage.setItem(key, JSON.stringify(wishlist));
            } catch (e) {
                console.error("Error saving wishlist to localStorage:", e);
            }
        }
    }, [wishlist, user, loading, prevUserEmail]);

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

    const manageUserProfile = async (name, photo, phone) => {
        setLoading(true);
        try {
            if (!auth.currentUser) {
                throw new Error('No authenticated user');
            }
            await updateProfile(auth.currentUser, {
                displayName: name,
                photoURL: photo || auth.currentUser.photoURL || ''
            });

            const currentUser = auth.currentUser;
            setUser(currentUser);

            if (currentUser?.email) {
                const userProfile = {
                    email: currentUser.email,
                    phone: phone || '',
                    name,
                    photoURL: photo || currentUser.photoURL || '',
                    memberSince: localStorage.getItem(`user_memberSince_${currentUser.email}`) || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                };
                localStorage.setItem(`user_profile_${currentUser.email}`, JSON.stringify(userProfile));
            }

            return currentUser;
        } finally {
            setLoading(false);
        }
    };

    const sendVerificationEmail = async () => {
        setLoading(true);
        try {
            if (!auth.currentUser) {
                throw new Error('No authenticated user');
            }
            return await sendEmailVerification(auth.currentUser);
        } finally {
            setLoading(false);
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
        sendVerificationEmail,
        getUserProfile
    }


    return (
        <AuthContext.Provider value={authData}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;