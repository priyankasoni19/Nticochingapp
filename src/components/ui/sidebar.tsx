'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { X, Menu } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader as SheetHeaderPrimitive } from '@/components/ui/sheet';

const SidebarContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
}>({
  isOpen: false,
  setIsOpen: () => null,
  isMobile: false,
});

export const useSidebar = () => {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }

  return context;
};

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = React.useState(!isMobile);

  React.useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isMobile]);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        setIsOpen,
        isMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

const sidebarVariants = cva(
  'z-40 flex h-full shrink-0 flex-col gap-4 border-r bg-card transition-all',
  {
    variants: {
      isOpen: {
        true: 'w-72 p-4',
        false: 'w-0 p-0 border-none',
      },
    },
    defaultVariants: {
      isOpen: true,
    },
  }
);


const SidebarRoot = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { isOpen, setIsOpen, isMobile } = useSidebar();

    if (isMobile) {
      return (
        <>
          <Button
            size="icon"
            variant="ghost"
            className="absolute left-4 top-4 z-50"
            onClick={() => setIsOpen(true)}
          >
            <Menu />
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="left" className="w-72 p-4">
              <SheetHeaderPrimitive className="mb-4">
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-4 top-4"
                  onClick={() => setIsOpen(false)}
                >
                  <X />
                </Button>
              </SheetHeaderPrimitive>
              <div ref={ref} className={cn('flex h-full flex-col gap-4', className)} {...props}>
                {children}
              </div>
            </SheetContent>
          </Sheet>
        </>
      );
    }

    return (
      <div
        ref={ref}
        data-testid="sidebar"
        className={cn(sidebarVariants({ isOpen }), className)}
        {...props}
      >
        {isOpen && children}
      </div>
    );
  }
);
SidebarRoot.displayName = 'Sidebar';


const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
    const { isOpen } = useSidebar();
    return isOpen ? (
        <div
        ref={ref}
        className={cn('flex h-12 shrink-0 items-center', className)}
        {...props}
        />
    ) : null;
    }
);
SidebarHeader.displayName = 'SidebarHeader';

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
    const { isOpen } = useSidebar();
    return isOpen ? (
        <div ref={ref} className={cn('flex-1 overflow-auto', className)} {...props} />
    ) : null;
    }
);
SidebarContent.displayName = 'SidebarContent';


const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
    const { isOpen } = useSidebar();
    return isOpen ? (
        <div
        ref={ref}
        className={cn('flex h-16 shrink-0 items-center', className)}
        {...props}
        />
    ) : null;
    }
);
SidebarFooter.displayName = 'SidebarFooter';

const sidebarMenuVariants = cva('flex flex-col', {
  variants: {
    isOpen: {
      true: 'gap-2',
      false: 'gap-0',
    },
  },
  defaultVariants: {
    isOpen: true,
  },
});

const SidebarMenu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
    const { isOpen } = useSidebar();
    return (
        <div
        ref={ref}
        className={cn(sidebarMenuVariants({ isOpen }), className)}
        {...props}
        />
    );
    }
);
SidebarMenu.displayName = 'SidebarMenu';

const SidebarMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('', className)} {...props} />;
    }
);
SidebarMenuItem.displayName = 'SidebarMenuItem';

const SidebarMenuButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & { isActive?: boolean }
>(({ isActive, className, children, ...props }, ref) => {
  const { isOpen } = useSidebar();

  return (
    <Button
      ref={ref}
      variant={isActive ? 'secondary' : 'ghost'}
      className={cn(
        'h-12 w-full',
        {
          'justify-start': isOpen,
          'justify-center': !isOpen,
        },
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
});
SidebarMenuButton.displayName = 'SidebarMenuButton';

const SidebarInset = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { isOpen, isMobile } = useSidebar();
    return (
      <div
        ref={ref}
        className={cn(
          'flex h-screen flex-1 flex-col transition-all',
          !isMobile && (isOpen ? 'ml-72' : 'ml-0'),
          className
        )}
        {...props}
      />
    );
  }
);
SidebarInset.displayName = 'SidebarInset';

const Sidebar = Object.assign(SidebarRoot, {
    Header: SidebarHeader,
    Content: SidebarContent,
    Footer: SidebarFooter,
    Menu: SidebarMenu,
    MenuItem: SidebarMenuItem,
    MenuButton: SidebarMenuButton,
    Inset: SidebarInset,
    Provider: SidebarProvider,
  });

export {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarInset,
};