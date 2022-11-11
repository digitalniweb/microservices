import { Op } from "sequelize";
import Module from "../../server/models/websites/module";
import WebsiteModule from "../../server/models/websites/websiteModule";

async function billingModules() {
	let offset = 0;
	let limit = 50;
	while (true) {
		let websiteModules = await WebsiteModule.findAll({
			limit,
			offset,
			where: {
				billingDay: new Date().getDate(),
			},
			include: {
				model: Module,
				where: {
					creditCostDay: { [Op.ne]: null },
				},
			},
		});

		websiteModules.forEach((websiteModule) => {
			console.log(websiteModule);
		});

		offset += limit;
		if (websiteModules.length === 0) break;
	}
}
export { billingModules };
