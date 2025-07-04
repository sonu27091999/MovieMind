import React from "react";
import { Link, NavLink } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { BiMoviePlay } from "react-icons/bi";
import { FaUserNinja } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../hooks";

export default function NavBar() {
	const { handleLogout } = useAuth();
	return (
		<nav className="w-48 min-h-screen bg-secondary border-r border-gray-300 ">
			<div className="flex flex-col justify-between sticky top-0 h-screen">
				<ul>
					<li className="pl-5 mb-4">
						<Link to="/">
							<img src="./logo.png" alt="LOGO" className="h-14 p-2"></img>
						</Link>
					</li>
					<li>
						<NavItem to="/">
							<AiOutlineHome></AiOutlineHome>
							<span>Home</span>
						</NavItem>
					</li>
					<li>
						<NavItem to="/movies">
							<BiMoviePlay></BiMoviePlay>
							<span>Movies</span>
						</NavItem>
					</li>
					<li>
						<NavItem to="/actors">
							<FaUserNinja></FaUserNinja>
							<span>Actors</span>
						</NavItem>
					</li>
				</ul>
				<div className=" text-white flex flex-col flex-start pl-5 mb-2">
					<span className="font-semibold text-white text-xl">Admin</span>
					<button
						className="flex space-x-1 items-center text-dark-subtle text-sm hover:text-white transition"
						onClick={handleLogout}>
						<FiLogOut></FiLogOut>
						<span>Log out</span>
					</button>
				</div>
			</div>
		</nav>
	);
}

const NavItem = ({ children, to }) => {
	const commonClasses =
		" flex items-center text-lg space-x-2 p-2 pl-5 hover:bg-neutral-600 transition";
	return (
		<NavLink
			className={({ isActive }) =>
				(isActive ? "bg-neutral-600 text-white" : "text-gray-400 bg-ne") +
				commonClasses
			}
			to={to}>
			{children}
		</NavLink>
	);
};
