import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { getTemplate } from "../../helpers/getTemplate";

interface IDescriptionLabelProps {
	data: any;
}

export const DescriptionLabel = ({ data }: IDescriptionLabelProps) => {
	const [template, setTemplate] = useState(getTemplate(data));
	useEffect(() => {
		setTemplate(getTemplate(data));
	}, [data]);

	if (!data) return null;

	return <blockquote className={styles.blockquote}>{template}</blockquote>;
};
