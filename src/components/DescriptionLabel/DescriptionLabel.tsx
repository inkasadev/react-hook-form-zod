import { getTemplate } from "../../helpers/getTemplate";
import styles from "./styles.module.css";

interface IDescriptionLabelProps {
	data: any;
}

export const DescriptionLabel = ({ data }: IDescriptionLabelProps) => {
	return (
		<blockquote className={styles.blockquote}>{getTemplate(data)}</blockquote>
	);
};
