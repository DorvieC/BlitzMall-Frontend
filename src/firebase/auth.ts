import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  signOut,
  updateProfile,
  type UserCredential,
} from 'firebase/auth';
import { firebaseAuth } from './config';

const ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'Цей email вже зареєстрований.',
  'auth/invalid-email': 'Некоректний формат email.',
  'auth/weak-password': 'Пароль занадто слабкий (мінімум 6 символів).',
  'auth/user-not-found': 'Користувача з таким email не знайдено.',
  'auth/wrong-password': 'Невірний пароль.',
  'auth/invalid-credential': 'Невірний email або пароль.',
  'auth/too-many-requests': 'Занадто багато спроб. Спробуйте пізніше.',
  'auth/network-request-failed': 'Проблема з мережею. Перевірте з\'єднання.',
};

export function mapFirebaseError(error: unknown): string {
  const code = (error as { code?: string })?.code ?? '';
  return ERROR_MESSAGES[code] ?? 'Сталася помилка. Спробуйте ще раз.';
}

export async function firebaseRegister(
  email: string,
  password: string,
  name: string,
): Promise<UserCredential> {
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  if (name) {
    await updateProfile(credential.user, { displayName: name });
  }
  return credential;
}

export async function firebaseLogin(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(firebaseAuth, email, password);
}

export async function firebaseGoogleLogin(): Promise<UserCredential> {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(firebaseAuth, provider);
}

export async function firebaseLogout(): Promise<void> {
  return signOut(firebaseAuth);
}

export async function firebaseSendPasswordReset(email: string): Promise<void> {
  return sendPasswordResetEmail(firebaseAuth, email, {
    url: `${window.location.origin}/new-password`,
    handleCodeInApp: true,
  });
}

export async function firebaseVerifyResetCode(oobCode: string): Promise<string> {
  return verifyPasswordResetCode(firebaseAuth, oobCode);
}

export async function firebaseConfirmPasswordReset(oobCode: string, newPassword: string): Promise<void> {
  return confirmPasswordReset(firebaseAuth, oobCode, newPassword);
}

export async function getFirebaseIdToken(credential: UserCredential): Promise<string> {
  return credential.user.getIdToken();
}
