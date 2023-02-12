import { getDaysInMonth } from "date-fns";
import { WhereOptions, Op } from "sequelize";
import Module from "../../server/models/globalData/module.js";
import WebsiteModule from "../../server/models/websites/websiteModule.js";

import { websites } from "../../digitalniweb-types/models/websites.js";
import WebsiteModuleType = websites.WebsiteModule;

async function billingModules() {
	let offset = 0;
	let limit = 50;
	let today = new Date();
	let todayDay = today.getDate();
	let thisMonthDaysCount = getDaysInMonth(today);
	let where: WhereOptions<WebsiteModuleType> = {
		billingDay: todayDay,
	};
	if (todayDay == thisMonthDaysCount) {
		// there can still more days which needs to be billed this month, not just today
		// (e.g. february has 28 days but there are billing days at 29, 30 and 31)
		where.billingDay = {
			[Op.gte]: todayDay,
		};
	}
	while (true) {
		let websiteModules = await WebsiteModule.findAll({
			limit,
			offset,
			where,
			include: {
				model: Module,
				where: {
					creditsCost: { [Op.ne]: null },
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
