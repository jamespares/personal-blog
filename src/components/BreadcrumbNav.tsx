/** @jsxImportSource hono/jsx */
import type { FC } from "hono/jsx";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export const BreadcrumbNav: FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <nav class="breadcrumb-nav" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span class="breadcrumb-nav__segment" key={`${item.label}-${index}`}>
            {index > 0 && <span class="breadcrumb-nav__sep" aria-hidden="true"> / </span>}
            {isLast || !item.href ? (
              <span class="breadcrumb-nav__current">{item.label}</span>
            ) : (
              <a href={item.href} class="breadcrumb-nav__link">{item.label}</a>
            )}
          </span>
        );
      })}
    </nav>
  );
};
