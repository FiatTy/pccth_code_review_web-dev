import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BadgeCheck, ChevronUp, KeyRound, Loader2, LogOut, MailCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { useToast } from '@/lib/toast/toast-context';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ChangePasswordModal } from '@/features/user/components/ChangePasswordModal';
import { useSendVerificationEmail } from '@/features/user/hooks/useAccount';

interface ProfileMenuProps {
  direction?: 'down' | 'up';
  variant?: 'default' | 'card';
}

export function ProfileMenu({ direction = 'down', variant = 'default' }: ProfileMenuProps) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const sendVerification = useSendVerificationEmail();

  const [isOpen, setIsOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const initial = user?.username?.charAt(0).toUpperCase() ?? '?';
  const isVerified = (user?.status ?? '').toUpperCase() === 'VERIFIED';

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  async function handleSendVerification() {
    if (!user?.id) {
      return;
    }
    setIsOpen(false);
    try {
      await sendVerification.mutateAsync(user.id);
      showToast({ tone: 'success', title: t('ACCOUNT.VERIFY_EMAIL_SENT') });
    } catch {
      showToast({ tone: 'error', title: t('ACCOUNT.VERIFY_EMAIL_FAILED') });
    }
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      showToast({ tone: 'error', title: t('ACCOUNT.LOGOUT_FAILED') });
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  }

  const itemClass =
    'flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-fg transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:text-faint';

  return (
    <div className={`relative ${variant === 'card' ? 'w-full' : ''}`} ref={containerRef}>
      {variant === 'card' ? (
        <button
          type="button"
          aria-label={t('ACCOUNT.MENU')}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="group flex w-full items-center justify-between rounded-2xl border border-border/70 bg-surface p-2.5 shadow-2xs transition-all hover:border-border-strong active:scale-[0.99]"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="brand-gradient-bg relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-primary-fg shadow-sm shadow-primary/30 transition-transform duration-200 group-hover:scale-105">
              {initial}
              {isVerified ? (
                <BadgeCheck
                  size={13}
                  className="absolute -bottom-0.5 -right-0.5 rounded-full bg-surface text-success"
                />
              ) : null}
            </div>
            <div className="min-w-0 text-left">
              <p className="truncate text-xs font-semibold text-fg">{user?.username}</p>
              <p className="font-mono text-[10px] uppercase tracking-wide text-faint">
                {user?.role}
              </p>
            </div>
          </div>
          <ChevronUp
            size={16}
            className={`text-muted transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-fg' : ''
            }`}
          />
        </button>
      ) : (
        <button
          type="button"
          aria-label={t('ACCOUNT.MENU')}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="group flex items-center gap-2.5 rounded-full border border-border bg-surface/60 py-1 pl-3.5 pr-1 shadow-sm backdrop-blur transition-all duration-200 hover:border-border-strong hover:shadow-md active:scale-[0.98]"
        >
          <div className="hidden text-right leading-tight sm:block">
            <div className="text-xs font-semibold text-fg">{user?.username}</div>
            <div className="font-mono text-[10px] uppercase tracking-wide text-faint">
              {user?.role}
            </div>
          </div>
          <div className="brand-gradient-bg relative flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-primary-fg shadow-sm shadow-primary/30 transition-transform duration-200 group-hover:scale-105">
            {initial}
            {isVerified ? (
              <BadgeCheck
                size={12}
                className="absolute -bottom-0.5 -right-0.5 rounded-full bg-surface text-success"
              />
            ) : null}
          </div>
        </button>
      )}

      {isOpen ? (
        <div
          className={`absolute right-0 z-50 w-60 overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-xl shadow-black/10 ${
            direction === 'up' ? 'bottom-11' : 'top-11'
          }`}
        >
          <div className="border-b border-border px-3 pb-2 pt-1">
            <p className="truncate text-sm font-medium text-fg">{user?.username}</p>
            <p className="truncate text-[11px] text-muted">{user?.email}</p>
            <span
              className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                isVerified ? 'bg-success/12 text-success' : 'bg-warning/12 text-warning'
              }`}
            >
              {isVerified ? t('ACCOUNT.VERIFIED') : t('ACCOUNT.UNVERIFIED')}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setShowPasswordModal(true);
            }}
            className={itemClass}
          >
            <KeyRound size={15} className="text-muted" />
            {t('ACCOUNT.CHANGE_PASSWORD')}
          </button>

          {!isVerified ? (
            <button
              type="button"
              onClick={() => void handleSendVerification()}
              disabled={sendVerification.isPending}
              className={itemClass}
            >
              {sendVerification.isPending ? (
                <Loader2 size={15} className="animate-spin text-muted" />
              ) : (
                <MailCheck size={15} className="text-muted" />
              )}
              {t('ACCOUNT.SEND_VERIFY_EMAIL')}
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setShowLogoutConfirm(true);
            }}
            className={`${itemClass} border-t border-border text-danger hover:bg-danger/8`}
          >
            <LogOut size={15} />
            {t('NAV.LOGOUT')}
          </button>
        </div>
      ) : null}

      {showPasswordModal ? (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      ) : null}

      {showLogoutConfirm ? (
        <ConfirmDialog
          tone="danger"
          title={t('ACCOUNT.LOGOUT_CONFIRM_TITLE')}
          message={t('ACCOUNT.LOGOUT_CONFIRM_TEXT')}
          confirmLabel={t('NAV.LOGOUT')}
          isPending={isLoggingOut}
          onConfirm={() => void handleLogout()}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      ) : null}
    </div>
  );
}
