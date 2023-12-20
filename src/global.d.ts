type FlatObject<T> = { [a: string]: T };

type Nullable<T> = T | null;

type ReactNodeChildren = { children?: React.ReactNode };
type ReactElementChildren = {
    children?: React.ReactElement;
    className?: string;
};
