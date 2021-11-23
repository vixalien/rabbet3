import Link from "./link";
import Title from "./title";

let items = {
	pages: "Pages",
	account: "Account",
};

let Header = ({ active = "pages", title, showNav = true }) => {
	return (
		<>
			<nav className="header">
				<div className="title">
					Rabbet <span className="badge">BETA</span>
				</div>
				{showNav && (
					<ul className="nav">
						{Object.entries(items).map((item, id) => {
							return (
								<li
									key={id}
									className={active == item[0] ? "selected" : undefined}
								>
									<Link href={"/" + item[0]}>{item[1]}</Link>
								</li>
							);
						})}
					</ul>
				)}
			</nav>
			{title && <Title {...title} />}
		</>
	);
};

export default Header;
