export class HeaderDto {
	readonly authorization: string
}

export interface IDecodedToken{
	_id:string,
	roles:string[]
}
