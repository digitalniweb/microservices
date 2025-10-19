// Associations dependent on 'globalData' data
import { getGlobalDataList } from "../../../digitalniweb-custom/helpers/getGlobalData.js";
import { consoleLogProduction } from "../../../digitalniweb-custom/helpers/logger.js";
import ArticleWidget from "./articleWidget.js";
import WidgetText from "./widgetText.js";

setTimeout(async () => {
	createAssociationsGlobalData();
}, 0);

export async function createAssociationsGlobalData() {
	try {
		let articleModule = await getGlobalDataList("modules", "name", [
			"articles",
		]);

		if (!articleModule?.[0])
			throw "Couldn't get 'articles' module data from globalData";

		if (!ArticleWidget.associations.WidgetText)
			ArticleWidget.belongsTo(WidgetText, {
				foreignKey: "widgetRowId",
				scope: { moduleId: articleModule?.[0].id },
				hooks: true,
			});
	} catch (error) {
		consoleLogProduction(
			error,
			"error",
			`GlobalData associations for '${process.env.MICROSERVICE_NAME}' fail.`
		);
	}
}
