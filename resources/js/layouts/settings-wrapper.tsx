import type { PropsWithChildren } from 'react';
import CustomAppLayout from '@/widgets/AppLayout/AppLayout';

export default function SettingsWrapper({ children }: PropsWithChildren) {
    return <CustomAppLayout activePage="settings">{children}</CustomAppLayout>;
}
