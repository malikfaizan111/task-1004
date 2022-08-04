import { Injectable } from '@angular/core';

@Injectable()
export class PaginationService {
	pages: any[] = [];

	setPagination(totalItems: number, currentPage: number, perPage: any) {
		// calculate total pages
		// let perPage = 20;
		let totalPages = Math.ceil(totalItems / perPage);
		let i: number, startItem: number, endItem: number;

		startItem = (currentPage * perPage) - (perPage - 1);
		if (currentPage * perPage < totalItems) {
			endItem = currentPage * perPage;
		}
		else {
			endItem = (totalItems - ((currentPage - 1) * perPage)) + ((currentPage - 1) * perPage);
		}

		// return object with all pager properties required by the view
		return {
			totalItems: totalItems,
			currentPage: currentPage,
			totalPages: totalPages,
			startItem: startItem,
			endItem: endItem
		};
	}
}