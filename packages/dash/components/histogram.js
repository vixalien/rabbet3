let Histogram = ({ data = [[]], indices = [] }) => {
	let hashJoaat = function (b) {
		for (var a = 0, c = b.length; c--; )
			(a += b.charCodeAt(c)), (a += a << 10), (a ^= a >> 6);
		a += a << 3;
		a ^= a >> 11;
		return (((a + (a << 15)) & 4294967295) >>> 0).toString(16);
	};
	let stringToColour = function (str) {
		var hash = 0;
		for (var i = 0; i < str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash);
		}
		var colour = "#";
		for (var i = 0; i < 3; i++) {
			var value = (hash >> (i * 8)) & 0xff;
			colour += ("00" + value.toString(16)).substr(-2);
		}
		return colour;
	};
	let colors = indices.map((_, index) =>
		stringToColour(hashJoaat(_ + index.toString()))
	);
	return (
		<div className="histogram-container">
			<style>
				{indices.map((_, index) => {
					return `.bar.bar-${index} {
					background-color: ${colors[index]}
				}`;
				})}
			</style>
			<div className="histogram">
				{data.map((item) => (
					<div className="block">
						<span className="bar-title">{item[0]}</span>
						<div className="bars">
							{item.slice(1).map((bar, index) => (
								<div className={`bar bar-` + index} style={{ height: bar }} />
							))}
						</div>
					</div>
				))}
			</div>
			<br />
			<div>
				{indices.map((index, n) => (
					<div>
						<div
							className="color-block"
							style={{ backgroundColor: colors[n] }}
						/>{" "}
						<b>{index}</b>
					</div>
				))}
			</div>
			<br />
		</div>
	);
};

export default Histogram;
