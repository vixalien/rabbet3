import NextLink from "next/link";

let Link = ({ href, linkProps = {}, children, ...props }) => {
	return (
		<NextLink href={href} {...linkProps}>
			<a {...props}>
				<>{children}</>
			</a>
		</NextLink>
	);
};

export default Link;
