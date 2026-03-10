export const clsx = (...classes) => classes.filter(Boolean).join(' ');

// Dummy tailwind-merge equivalent for simplicity if we don't end up using the real package
export const cn = (...classes) => {
    // Normally tailwind-merge would dedupe classes here
    return clsx(...classes);
};
