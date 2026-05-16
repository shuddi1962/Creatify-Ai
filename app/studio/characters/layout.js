import { CharactersSidebar } from '@/components/sidebars/CharactersSidebar'

export default function CharactersLayout({ children }) {
  return (
    <div className="section-layout">
      <div className="section-sidebar-wrapper"><CharactersSidebar /></div>
      <main>{children}</main>
    </div>
  )
}
