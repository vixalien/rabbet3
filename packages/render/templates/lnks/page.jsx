let Page = ({ page = { links: [] } }) => {
	let Link = ({ link }) => {
		let url = (link.url||"").split(/([\/\?\#\&])/).map(function (el, index) {
			if (index % 2 === 1)
				return <span key={index}>
					{el}
					<wbr/>
				</span>
			else return el;
		});
		return <>
			<dt>{link.label}</dt>
			<dd>
				<a href={link.url} target="_blank" rel="noopener noreferrer">{ url }</a>
			</dd>
		</>
	}

	return <>
		<div class="blank-space">
			<br />
			<br />
			<br />
			<br />
		</div>
		{ page.hero && <>
				{ (page.hero.type == "yembed") && <lite-youtube videoid={ page.hero.value } playlabel="Hero youtube video"></lite-youtube> }
			</>
		}
		{/*<div class="account-name">{account.displayName}</div>*/}
		<h1 class="link-label">{ page.label }</h1>
		<div class="link-about">{ page.about }</div>
		<dl class="links">
			{ page.links.map((link, id) => <Link key={id} link={link}/>) }
		</dl>
		<div>
			<div><br/><br/></div>
			By using this service, you agree to the use of cookies.<br/>
			Powered by <a href="/">Rabbet.</a>
		</div>
	</>
}

export default Page;