import unittest

from spreadsheets.tests.test__spreadsheets_api import SpreadsheetsTest

def run_tests():
    unittest.TestProgram(module='spreadsheets.tests')


if __name__ == "__main__":
    unittest.main()
