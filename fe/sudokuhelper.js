export class SudokuHelper {
    constructor() {
        this.cells = []
        for (let i = 0; i < 9; i++) {
            const row = []
            for (let j = 0; j < 9; j++) {
                row.push([1, 2, 3, 4, 5, 6, 7, 8, 9])
            }
            this.cells.push(row)
        }
    }
    get(row, col) {
        return this.cells[row][col]
    }

    delete(row, col, val) {
        const arr = this.cells[row][col]
        const index = arr.indexOf(val)
        if (index < 0) {
            return false
        }
        arr.splice(index, 1)
        this.cells[row][col] = arr
        return true
    }

    clear(row, col) {
        this.cells[row][col] = []
    }
}

/*

class SudokuHelper < Array
	def row( number )
		if block_given?
			self[ number ].each { |n| yield n }
			self
		else
			return self[ number ]
		end
	end
	
	def row_with_index( number )
		index = 0
		row( number ) do |r| 
			r.each { |n| yield n, index }
			index += 1
		end
		self
	end
	
	def row!( number )
		edited = false
		self[ number ].collect! do |n| 
			val = n.dup
			yield n
			edited = val != n unless edited
			n
		end
		return edited ? self[ number ] : nil
	end
	
	def col( number )
		if block_given?
			(0...9).each { |r| yield self[ r ][ number ] }
			self
		else
			carr = []
			col( number ) { |r| carr << r }
			return carr
		end
	end
	
	def col_with_index( number )
		index = 0
		col( number ) do |c|
			c.each { |n| yield n, index }
			index += 1	
		end
		self
	end
	
	def col!( number )
		edited = false
		(0...9).each do |r|
			val = self[ r ][ number ].dup
			self[ r ][ number ] = yield self[ r ][ number ]
			edited = self[ r ][ number ] != val unless edited
		end
		return edited ? col( number ) : nil
	end
	
	def square( number )
		if block_given?
			cs = ( number % 3 ) * 3
			rs = ( number / 3 ) * 3
			(0...3).each do |m|
				(0...3).each do |n|
					yield self[ m + rs ][ n + cs ]
				end
			end
			self
		else
			sarr = []
			square( number ) { |n| sarr << n }
			return sarr
		end
	end
	
	def square!( number )
		cs = ( number % 3 ) * 3
		rs = ( number / 3 ) * 3
		edited = false
		(0...3).each do |m|
			(0...3).each do |n|
				val = self[ m + rs ][ n + cs ].dup
				self[ m + rs ][ n + cs ] = yield self[ m + rs ][ n + cs ]
				edited = self[ m + rs ][ n + cs ] != val unless edited
			end
		end
		return edited ? square( number ) : nil
	end
end
*/
