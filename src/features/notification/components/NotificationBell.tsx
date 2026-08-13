import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Bell, BellOff, Check, Loader2, X } from 'lucide-react';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from '@/features/notification/hooks/useNotifications';
import { useToast } from '@/lib/toast/toast-context';
import type { AppNotification } from '@/features/notification/types';

type NotificationTab = 'All' | 'Unread' | 'Scans' | 'Issues' | 'System';

const TABS: { value: NotificationTab; labelKey: string }[] = [
  { value: 'All', labelKey: 'NOTIFICATION.TAB_ALL' },
  { value: 'Unread', labelKey: 'NOTIFICATION.TAB_UNREAD' },
  { value: 'Scans', labelKey: 'NOTIFICATION.TAB_SCANS' },
  { value: 'Issues', labelKey: 'NOTIFICATION.TAB_ISSUES' },
  { value: 'System', labelKey: 'NOTIFICATION.TAB_SYSTEM' },
];
function useTimeAgo() {
  const { t } = useTranslation();
  return (value: string): string => {
    const time = new Date(value).getTime();
    if (Number.isNaN(time)) {
      return t('NOTIFICATION.JUST_NOW');
    }
    const seconds = Math.max(0, Math.floor((Date.now() - time) / 1000));
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(seconds / 86400);

    if (minutes < 1) {
      return t('NOTIFICATION.JUST_NOW');
    }
    if (minutes < 60) {
      return t('NOTIFICATION.MINUTES_AGO', { count: minutes });
    }
    if (hours < 24) {
      return t('NOTIFICATION.HOURS_AGO', { count: hours });
    }
    return t('NOTIFICATION.DAYS_AGO', { count: days });
  };
}

export function NotificationBell() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const timeAgo = useTimeAgo();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NotificationTab>('All');
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = useMemo(() => data ?? [], [data]);
  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications],
  );

  const visible = useMemo(() => {
    let filtered = notifications;
    if (activeTab === 'Unread') {
      filtered = filtered.filter((item) => !item.isRead);
    } else if (activeTab !== 'All') {
      const activeLower = activeTab.toLowerCase();
      filtered = filtered.filter((item) => {
        const itemTypeLower = (item.type ?? '').toLowerCase();
        return (
          itemTypeLower === activeLower ||
          itemTypeLower.includes(activeLower.replace(/s$/, '')) ||
          activeLower.includes(itemTypeLower)
        );
      });
    }
    return filtered
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [activeTab, notifications]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function updateBodyOverflow() {
      if (window.innerWidth < 768) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    updateBodyOverflow();
    window.addEventListener('resize', updateBodyOverflow);

    function handlePointerDown(event: MouseEvent) {
      if (
        window.innerWidth >= 768 &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
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
      document.body.style.overflow = '';
      window.removeEventListener('resize', updateBodyOverflow);
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  function selectTab(tab: NotificationTab) {
    setActiveTab(tab);
  }

  function consume(notification: AppNotification) {
    if (!notification.isRead) {
      markRead.mutate(notification.id);
    }
  }

  function openTarget(notification: AppNotification) {
    consume(notification);
    setIsOpen(false);

    if (notification.type === 'Issues') {
      if (!notification.relatedIssueId) {
        showToast({
          tone: 'error',
          title: t('NOTIFICATION.CANNOT_OPEN_ISSUE'),
        });
        return;
      }
      navigate(`/issuedetail/${notification.relatedIssueId}`);
      return;
    }

    if (notification.type === 'Scans') {
      if (!notification.relatedScanId) {
        showToast({ tone: 'error', title: t('NOTIFICATION.CANNOT_OPEN_SCAN') });
        return;
      }
      navigate(`/scanresult/${notification.relatedScanId}`);
      return;
    }

    const title = notification.title ?? '';
    if (title.includes('Generate') || title.includes('Report')) {
      navigate('/reporthistory');
      return;
    }
    if (title.includes('Quality Gate')) {
      if (notification.relatedProjectId) {
        navigate(`/detailrepo/${notification.relatedProjectId}`);
      } else {
        showToast({
          tone: 'error',
          title: t('NOTIFICATION.CANNOT_OPEN_PROJECT'),
        });
      }
      return;
    }
    if (notification.relatedIssueId) {
      navigate(`/issuedetail/${notification.relatedIssueId}`);
      return;
    }
    if (notification.relatedScanId) {
      navigate(`/scanresult/${notification.relatedScanId}`);
      return;
    }
    if (notification.relatedProjectId) {
      navigate(`/detailrepo/${notification.relatedProjectId}`);
      return;
    }
    showToast({ tone: 'info', title: t('NOTIFICATION.NO_DETAILS') });
  }

  return (
    <div id="tour-notification-bell" className="relative" ref={containerRef}>
      <button
        type="button"
        aria-label={t('NOTIFICATION.TITLE')}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/60 text-muted shadow-sm backdrop-blur transition-all duration-200 hover:border-border-strong hover:text-fg active:scale-95"
      >
        <Bell size={16} />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 font-mono text-[10px] font-semibold leading-none text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div
          id="tour-notification-dropdown"
          className="fixed inset-0 z-50 flex flex-col bg-surface shadow-2xl transition-all md:absolute md:right-0 md:top-11 md:inset-auto md:z-50 md:h-auto md:w-[22rem] md:max-w-[calc(100vw-2rem)] md:overflow-hidden md:rounded-xl md:border md:border-border md:shadow-xl md:shadow-black/10"
        >
          <div className="flex h-14 items-center justify-between gap-2 border-b border-border px-4 py-3 md:h-auto">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                aria-label={t('COMMON.CLOSE')}
                onClick={() => setIsOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg md:hidden"
              >
                <ArrowLeft size={20} />
              </button>
              <p className="truncate text-base font-semibold text-fg md:text-sm">
                {t('NOTIFICATION.TITLE')}
              </p>
              {unreadCount > 0 ? (
                <span className="inline-flex h-5 items-center justify-center rounded-full bg-primary/10 px-2 font-mono text-xs font-semibold text-primary">
                  {unreadCount}
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => markAllRead.mutate()}
                disabled={unreadCount === 0}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary-subtle disabled:cursor-not-allowed disabled:text-faint disabled:hover:bg-transparent md:text-[11px]"
              >
                <Check size={13} />
                <span>{t('NOTIFICATION.MARK_ALL_READ')}</span>
              </button>
              <button
                type="button"
                aria-label={t('COMMON.CLOSE')}
                onClick={() => setIsOpen(false)}
                className="hidden h-7 w-7 items-center justify-center rounded-md text-faint transition-colors hover:bg-surface-2 hover:text-fg md:inline-flex"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto overscroll-x-contain border-b border-border px-4 py-2.5 scrollbar-none md:px-3 md:py-2">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => selectTab(tab.value)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors md:rounded-md md:px-2 md:py-1 md:text-[11px] ${
                  activeTab === tab.value
                    ? 'bg-primary-subtle text-primary font-semibold'
                    : 'text-muted hover:bg-surface-2 hover:text-fg'
                }`}
              >
                {t(tab.labelKey)}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain divide-y divide-border/60 md:max-h-80">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 px-4 py-16 text-sm text-muted md:py-10 md:text-xs">
                <Loader2 size={16} className="animate-spin text-primary" />
                {t('COMMON.LOADING')}
              </div>
            ) : null}

            {isError ? (
              <p className="px-4 py-16 text-center text-sm text-danger md:py-10 md:text-xs">
                {t('NOTIFICATION.LOAD_ERROR')}
              </p>
            ) : null}

            {!isLoading && !isError && visible.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-4 py-20 text-center md:py-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-faint">
                  <BellOff size={24} />
                </div>
                <p className="text-sm text-muted md:text-xs">{t('NOTIFICATION.EMPTY')}</p>
              </div>
            ) : null}

            {visible.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => openTarget(notification)}
                className={`flex w-full flex-col gap-1.5 px-4 py-3.5 text-left transition-colors hover:bg-surface-2 active:bg-surface-2/80 md:py-3 ${
                  notification.isRead ? '' : 'bg-primary-subtle/30'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full md:h-1.5 md:w-1.5 ${
                      notification.isRead ? 'bg-transparent' : 'bg-primary'
                    }`}
                  />
                  <span className="min-w-0 flex-1 text-sm font-semibold text-fg md:text-xs">
                    {notification.title}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-faint md:text-[10px]">
                    {timeAgo(notification.createdAt)}
                  </span>
                </div>
                <p className="pl-4.5 text-xs leading-relaxed text-muted md:pl-3.5 md:text-[11px]">
                  {notification.message}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
