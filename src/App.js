import React, { useState, useEffect } from "react";
import "./App.css";
import plusIcon from "./icons/plus.svg";
import delListIcon from "./icons/playlist-x.svg";
import trashIcon from "./icons/trash.svg";

function App() {
	const [list, setList] = useState([]);
	const [newArticle, setNewArticle] = useState({ name: "", amount: "" });

	/* Arrow-Functions um Artikel hinzuzufügen und zu entfernen sowie die Liste zu löschen */

	const handleSubmit = (e) => {
		e.preventDefault();

		const newItem = { ...newArticle, id: list.length + 1 };
		const newList = [...list, newItem];

		/* Spread-Operator (...newArticle)
		gibt alle Props eines Objects bzw. alle Elemente eines Arrays einzeln zurück.

		const newItem = {name: newArticle.name, amount: newArticle.amount, id: list.length + 1}
		wäre auch möglich, allerdings wird das bei Objekten mit vielen Props schnell sehr aufwendig.
		*/

		saveToLocalStorage(newList);
		setList(newList);

		setNewArticle({ name: "", amount: "" });
	};

	const removeItem = (id) => {
		const newList = list.filter((item) => item.id !== id);
		saveToLocalStorage(newList);
		setList(newList);
	};

	const resetList = () => {
		clearLocalStorage();
		setList([]);
	};

	/* Funktionen für persistentes Speichern (nicht so wichtig) */

	const saveToLocalStorage = (articleList) => {
		let stringArray = [];

		articleList.forEach((article) => {
			const stringArticle = JSON.stringify(article);
			stringArray.push(stringArticle);
		});

		localStorage.setItem("list", stringArray.join("|"));
	}

	const getFromLocalStorage = () => {
		if (localStorage.list) {
			const localList = localStorage.getItem("list").split("|");
			let objectArray = [];

			localList.forEach((article) => {
				const objectArticle = JSON.parse(article);
				objectArray.push(objectArticle);
			});

			return objectArray;
		} else return null;
	}

	const clearLocalStorage = () => {
		localStorage.removeItem("list");
	}

	/* useEffect:
	Die Aufrufe innerhalb useEffect (hier setList(...)) werden ausgeführt:
	- beim ersten Rendern der Komponente
	- wenn sich eine Variable im Dependency Array (hier: []) ändert

	Würde man setList(getFromLocalStorage()) außerhalb von useEffect verwenden, würde es bei jedem Re-
	Render erneut ausgeführt werden. Ein Re-Render wird z.B. durch die Änderung eines States ausgelöst.
	*/
	useEffect(() => {
		setList(getFromLocalStorage() || []);
	}, []);

	/* Inhalt der Komponente */

	return (
		<div className="App">
			<div>
				<p>neuen Artikel hinzufügen:</p>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						value={newArticle.name}
						onChange={(e) =>
							setNewArticle({
								...newArticle,
								name: e.target.value,
							})
						}
						placeholder="Artikel"
					/>
					<input
						type="number"
						value={newArticle.amount}
						onChange={(e) =>
							setNewArticle({
								...newArticle,
								amount: e.target.value,
							})
						}
						placeholder="Menge"
					/>
					<button type="submit" title="Artikel hinzufügen">
						<img src={plusIcon} alt="hinzufügen" />
					</button>
					<button
						type="button"
						title="List löschen"
						onClick={resetList}
					>
						<img src={delListIcon} alt="hinzufügen" />
					</button>
				</form>
			</div>
			<hr />
			<ul>
				{list.map((item) => (
					<li key={item.id}>
						<div>
							{item.name} ({item.amount})
						</div>
						<button
							title="Artikel löschen"
							onClick={() => removeItem(item.id)}
						>
							<img src={trashIcon} alt="löschen" />
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
