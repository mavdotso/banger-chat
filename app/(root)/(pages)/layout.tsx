import SidebarWrapper from '@/components/shared/sidebar/sidebar-wrapper';

type Props = React.PropsWithChildren<{}>;

export default function PagesLayout({ children }: Props) {
    return <SidebarWrapper>{children}</SidebarWrapper>;
}
