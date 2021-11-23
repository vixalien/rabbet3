let Page = ({ page, account }) => {
	return (
		<>
			<div className="blank-space">
				<br />
				<br />
				<br />
				<br />
			</div>
			<div className="account-name">{account.names}</div>
			<h1 className="link-name">{page.name}</h1>
			<div className="link-about">{page.about}</div>
			<dl className="links">
				{page.links.map((link) => {
					let url = link.url.split(/([\/\?\#\&])/).map(function (el, index) {
						if (index % 2 === 1)
							return (
								<>
									{el}
									<wbr />
								</>
							);
						else return el;
					});
					return (
						<>
							<dt>{link.name}</dt>
							<dd>
								<a href={link.url} target="_blank" rel="noopener noreferrer">
									{url}
								</a>
							</dd>
						</>
					);
				})}
			</dl>
		</>
	);
};

export default Page;
