'use client';

import {
  Children,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  createContext,
  Fragment,
  isValidElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Image, { type ImageProps } from 'next/image';
import { Avatar as AvatarPrimitive } from 'radix-ui';

import { cn } from '@/lib/design/utils';

type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';
const DEFAULT_AVATAR_FALLBACK_DELAY_MS = 300;

type AvatarContextValue = {
  hasSource: boolean;
  imageStatus: ImageLoadingStatus;
  setImageStatus: (status: ImageLoadingStatus) => void;
};

const AvatarContext = createContext<AvatarContextValue | null>(null);

function containsAvatarImageSource(children: ReactNode): boolean {
  return Children.toArray(children).some((child) => {
    if (!isValidElement(child)) {
      return false;
    }

    if (child.type === Fragment) {
      const fragmentProps = child.props as { children?: ReactNode };
      return containsAvatarImageSource(fragmentProps.children);
    }

    const childProps = child.props as { src?: ImageProps['src'] };
    return Boolean(childProps.src);
  });
}

function useAvatarContext() {
  return useContext(AvatarContext);
}

function Avatar({
  className,
  size = 'default',
  children,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: 'default' | 'sm' | 'lg' | 'xl';
}) {
  const hasSource = containsAvatarImageSource(children);
  const [imageStatus, setImageStatus] = useState<ImageLoadingStatus>(
    hasSource ? 'loading' : 'idle'
  );

  return (
    <AvatarContext.Provider value={{ hasSource, imageStatus, setImageStatus }}>
      <AvatarPrimitive.Root
        data-slot="avatar"
        data-size={size}
        className={cn(
          'group/avatar after:border-border relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 data-[size=xl]:size-14 dark:after:mix-blend-lighten',
          className
        )}
        {...props}
      >
        {children}
      </AvatarPrimitive.Root>
    </AvatarContext.Provider>
  );
}

function AvatarImage({
  className,
  onError,
  onLoad,
  onLoadingStatusChange,
  loading = 'eager',
  sizes = '100%',
  src,
  unoptimized = true,
  ...props
}: Omit<ImageProps, 'fill'> & {
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
}) {
  const avatarContext = useAvatarContext();
  const setImageStatus = avatarContext?.setImageStatus;
  const imageRef = useRef<HTMLImageElement>(null);

  const updateImageStatus = useCallback(
    (status: ImageLoadingStatus) => {
      setImageStatus?.(status);
      onLoadingStatusChange?.(status);
    },
    [onLoadingStatusChange, setImageStatus]
  );

  useEffect(() => {
    if (!src) {
      updateImageStatus('error');
      return;
    }

    updateImageStatus('loading');

    const image = imageRef.current;
    if (image?.complete && image.naturalWidth > 0) {
      updateImageStatus('loaded');
    }
  }, [src, updateImageStatus]);

  return (
    <Image
      data-slot="avatar-image"
      fill
      ref={imageRef}
      src={src}
      loading={loading}
      sizes={sizes}
      unoptimized={unoptimized}
      className={cn(
        'aspect-square size-full rounded-full object-cover',
        className
      )}
      onLoad={(event) => {
        updateImageStatus('loaded');
        onLoad?.(event);
      }}
      onError={(event) => {
        updateImageStatus('error');
        onError?.(event);
      }}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: ComponentPropsWithoutRef<'span'>) {
  const avatarContext = useAvatarContext();
  const imageStatus = avatarContext?.imageStatus ?? 'idle';
  const fallbackDelayMs = avatarContext?.hasSource
    ? DEFAULT_AVATAR_FALLBACK_DELAY_MS
    : 0;
  const shouldShow = imageStatus === 'idle' || imageStatus === 'error';
  const visibilityKey = `${imageStatus}:${fallbackDelayMs}`;
  const [visibleKey, setVisibleKey] = useState(
    shouldShow && !fallbackDelayMs ? visibilityKey : null
  );

  useEffect(() => {
    if (!shouldShow) {
      setVisibleKey(null);
      return;
    }

    if (!fallbackDelayMs) {
      setVisibleKey(visibilityKey);
      return;
    }

    setVisibleKey(null);
    const timeoutId = window.setTimeout(
      () => setVisibleKey(visibilityKey),
      fallbackDelayMs
    );

    return () => window.clearTimeout(timeoutId);
  }, [fallbackDelayMs, shouldShow, visibilityKey]);

  if (!shouldShow || visibleKey !== visibilityKey) {
    return null;
  }

  return (
    <span
      data-slot="avatar-fallback"
      className={cn(
        'bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full text-sm group-data-[size=sm]/avatar:text-xs',
        className
      )}
      {...props}
    />
  );
}

function AvatarBadge({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        'bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-blend-color ring-2 select-none',
        'group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden',
        'group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2',
        'group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2',
        className
      )}
      {...props}
    />
  );
}

function AvatarGroup({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        'group/avatar-group *:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2',
        className
      )}
      {...props}
    />
  );
}

function AvatarGroupCount({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        'bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm ring-2 group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3',
        className
      )}
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
};
